import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, FormControl, FormControlLabel, Switch } from '@material-ui/core';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, deleteTask, setShouldGoToTask } from '@logan/fe-shared/store/tasks';
import { setShouldGoToAssignment, getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import { getSections } from '@logan/fe-shared/sorting/tasks';
import Fab from '../shared/controls/fab';
import ListHeader from '../shared/list-header';
import '../shared/list.scss';
import ListSubheader from '../shared/list-subheader';
import TaskCell from './task-cell';
import styles from './tasks-list.module.scss';
import TaskModal from './task-modal';

class TasksList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectTask = this.didSelectTask.bind(this);
        this.didDeleteTask = this.didDeleteTask.bind(this);
        this.toggleCompletedTasks = this.toggleCompletedTasks.bind(this);
        this.openCreateModal = this.openCreateModal.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);

        this.state = {
            showingCompletedTasks: false,
            selectedTid: undefined,
            newTaskModalOpen: false,
        };
    }

    componentDidMount() {
        if (this.props.shouldGoToTask) {
            this.handleGoToTask();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.shouldGoToTask && this.props.shouldGoToTask !== prevProps.shouldGoToTask) {
            this.handleGoToTask();
        }
    }

    handleGoToTask() {
        const selectedTask = this.props.getTask(this.props.shouldGoToTask);

        this.setState({ showingCompletedTasks: selectedTask.complete });
        this.didSelectTask(this.props.shouldGoToTask);
        this.props.setShouldGoToTask(undefined);
    }

    didSelectTask(tid) {
        this.setState(() => ({ selectedTid: tid }));
        this.props.onTaskSelected(tid);
    }

    didDeleteTask(task) {
        this.props.deleteTask(task);
        this.didSelectTask(undefined);
    }

    openCreateModal() {
        this.setState({ newTaskModalOpen: true });
    }

    closeCreateModal({ newTask }) {
        this.setState({ newTaskModalOpen: false });

        if (newTask && newTask.tid) {
            this.didSelectTask(newTask.tid);
        }
    }

    toggleCompletedTasks(e) {
        this.setState({ showingCompletedTasks: e.target.checked });
    }

    _headerForSection(dueDate) {
        let sectionTitle = dueDate;
        let sectionDetail;

        const isDate = dateUtils.dueDateIsDate(dueDate);
        const isToday = dateUtils.formatAsDate() === dueDate;
        const isOverdue = dueDate === 'Overdue';

        if (isDate) {
            const dateObject = dateUtils.toDate(dueDate);
            sectionTitle = dateUtils.readableDueDate(dateObject, { includeWeekday: true });

            if (!isToday) {
                sectionDetail = `${dateObject.diff(dateUtils.dayjs().startOf('day'), 'day')}D`;
            }
        }

        return (
            <ListHeader
                color={isOverdue ? 'error' : undefined}
                className={`list-header ${styles.header}`}
                title={sectionTitle}
                detail={sectionDetail}
                isBig={isToday}
            />
        );
    }

    _contentsForSection(groups) {
        const contents = [];

        for (const {
            meta: { cid, aid },
            tids,
        } of groups) {
            const sortKey = `${cid || ''} ${aid || ''}`;

            if (cid || aid) {
                const items = [];
                const colors = [];

                if (cid) {
                    const course = this.props.getCourse(cid);

                    if (course) {
                        items.push(!_.isEmpty(course.nickname) ? course.nickname : course.title);
                        colors.push(course.color);
                    }
                }

                if (aid) {
                    const assignment = this.props.getAssignment(aid);

                    if (assignment) {
                        items.push(assignment.title);
                        colors.push('textPrimary');
                    }
                }

                contents.push(
                    <ListSubheader key={sortKey} classes={{ root: styles.subheader }} items={items} colors={colors} />
                );
            }

            contents.push(
                ...tids.map(tid => (
                    <TaskCell
                        key={tid}
                        tid={tid}
                        showOverdueLabel={!this.state.showingCompletedTasks}
                        onSelect={this.didSelectTask}
                        onDelete={this.didDeleteTask}
                        selected={this.state.selectedTid === tid}
                    />
                ))
            );
        }

        return contents;
    }

    render() {
        const tasks = _.filter(
            this.props.tids.map(tid => this.props.getTask(tid)),
            task => task.complete === this.state.showingCompletedTasks
        );

        const sections = getSections(tasks, this.state.showingCompletedTasks, this.props.getAssignment);

        return (
            <div className="scrollable-list">
                <div className={`scroll-view ${styles.tasksList}`}>
                    <List className={styles.listContent}>
                        {sections.map(([dueDate, groups]) => (
                            <div className={styles.section} key={dueDate}>
                                {this._headerForSection(dueDate)}
                                {this._contentsForSection(groups)}
                            </div>
                        ))}
                    </List>
                </div>
                <div className={styles.actionsBar}>
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    classes={{ root: styles.switch }}
                                    color="default"
                                    checked={this.state.showingCompletedTasks}
                                    onChange={this.toggleCompletedTasks}
                                />
                            }
                            label={
                                this.state.showingCompletedTasks ? 'Showing completed tasks' : 'Showing remaining tasks'
                            }
                        />
                    </FormControl>
                </div>
                <Fab className="add-button" onClick={this.openCreateModal} />
                <TaskModal open={this.state.newTaskModalOpen} onClose={this.closeCreateModal} />
            </div>
        );
    }
}

TasksList.propTypes = {
    tids: PropTypes.array,
    getTask: PropTypes.func,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
    deleteTask: PropTypes.func,
    onTaskSelected: PropTypes.func,
    shouldGoToTask: PropTypes.string,
    setShouldGoToTask: PropTypes.func,
    setShouldGoToAssignment: PropTypes.func,
};

const mapStateToProps = state => {
    const tasksSelectors = getTasksSelectors(state.tasks);

    return {
        shouldGoToTask: state.tasks.shouldGoToTask,
        tids: tasksSelectors.selectIds(),
        getTask: tasksSelectors.selectById,
        getAssignment: getAssignmentsSelectors(state.assignments).selectById,
        getCourse: getCourseSelectors(state.schedule).selectById,
    };
};

const mapDispatchToProps = { deleteTask, setShouldGoToTask, setShouldGoToAssignment };

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
