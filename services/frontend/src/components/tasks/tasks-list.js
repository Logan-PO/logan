import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, AppBar, Toolbar, FormControl, FormControlLabel, Switch, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getTasksSelectors, deleteTask, setShouldGoToTask } from '@logan/fe-shared/store/tasks';
import { setShouldGoToAssignment } from '@logan/fe-shared/store/assignments';
import TaskCell from './task-cell';
import '../shared/list.scss';
import styles from './tasks-list.module.scss';
import TaskModal from './task-modal';
import { getSections } from './sorting';

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

    render() {
        const tasks = _.filter(
            this.props.tids.map(tid => this.props.getTask(tid)),
            task => task.complete === this.state.showingCompletedTasks
        );

        const sections = getSections(tasks, this.state.showingCompletedTasks);

        return (
            <div className="scrollable-list">
                <div className={`scroll-view ${styles.tasksList}`}>
                    <List>
                        {sections.map(section => {
                            const [dueDate, tids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <ListSubheader>{dueDate}</ListSubheader>
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
                                </React.Fragment>
                            );
                        })}
                    </List>
                </div>
                <AppBar position="relative" color="primary" className={styles.actionsBar}>
                    <Toolbar variant="dense">
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="default"
                                        checked={this.state.showingCompletedTasks}
                                        onChange={this.toggleCompletedTasks}
                                    />
                                }
                                label={this.state.showingCompletedTasks ? 'Completed tasks' : 'Remaining tasks'}
                            />
                        </FormControl>
                    </Toolbar>
                </AppBar>
                <Fab className="add-button" color="secondary" onClick={this.openCreateModal}>
                    <AddIcon />
                </Fab>
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
