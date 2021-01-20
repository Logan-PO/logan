import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, FormControl, FormControlLabel, Switch } from '@material-ui/core';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, deleteTask, setShouldGoToTask } from '@logan/fe-shared/store/tasks';
import { setShouldGoToAssignment } from '@logan/fe-shared/store/assignments';
import { getSections } from '@logan/fe-shared/sorting/tasks';
import Fab from '../shared/controls/fab';
import ListHeader from '../shared/list-header';
import '../shared/list.scss';
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
        // TODO: Select next task
        this.setState(() => ({ selectedTid: undefined }));
        this.props.onTaskSelected(undefined);
    }

    openCreateModal() {
        this.setState({ newTaskModalOpen: true });
    }

    closeCreateModal() {
        this.setState({ newTaskModalOpen: false });
    }

    toggleCompletedTasks(e) {
        this.setState({ showingCompletedTasks: e.target.checked });
    }

    _headerForSection(section) {
        const [dueDate] = section;

        let sectionTitle = dueDate;
        let sectionDetail;

        const isDate = dateUtils.dueDateIsDate(dueDate);
        const isToday = dateUtils.formatAsDate() === dueDate;
        const isOverdue = dueDate === 'Overdue';

        if (isDate) {
            const dateObject = dateUtils.toDate(dueDate);
            sectionTitle = dateUtils.readableDueDate(dateObject, false);

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

    render() {
        const tasks = _.filter(
            this.props.tids.map(tid => this.props.getTask(tid)),
            task => task.complete === this.state.showingCompletedTasks
        );

        const sections = getSections(tasks, this.state.showingCompletedTasks);

        return (
            <div className="scrollable-list">
                <div className={`scroll-view ${styles.tasksList}`}>
                    <List className={styles.listContent}>
                        {sections.map(section => {
                            const tids = section[1];

                            return (
                                <div className={styles.section} key={section[0]}>
                                    {this._headerForSection(section)}
                                    {tids.map(tid => (
                                        <TaskCell
                                            key={tid}
                                            tid={tid}
                                            showOverdueLabel={!this.state.showingCompletedTasks}
                                            onSelect={this.didSelectTask}
                                            onDelete={this.didDeleteTask}
                                            selected={this.state.selectedTid === tid}
                                        />
                                    ))}
                                </div>
                            );
                        })}
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
    deleteTask: PropTypes.func,
    onTaskSelected: PropTypes.func,
    shouldGoToTask: PropTypes.string,
    setShouldGoToTask: PropTypes.func,
    setShouldGoToAssignment: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getTasksSelectors(state.tasks);

    return {
        shouldGoToTask: state.tasks.shouldGoToTask,
        tids: getTasksSelectors(state.tasks).selectIds(),
        getTask: selectors.selectById,
    };
};

const mapDispatchToProps = { deleteTask, setShouldGoToTask, setShouldGoToAssignment };

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
