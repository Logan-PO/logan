import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, AppBar, Toolbar, FormControl, FormControlLabel, Switch, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getTasksSelectors, fetchTasks, createTask, deleteTask } from '../../store/tasks';
import TaskCell from './task-cell';
import '../shared/list.scss';
import styles from './tasks-list.module.scss';
import { getSections } from './sorting';

class TasksList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectTask = this.didSelectTask.bind(this);
        this.didDeleteTask = this.didDeleteTask.bind(this);
        this.toggleCompletedTasks = this.toggleCompletedTasks.bind(this);

        this.state = {
            showingCompletedTasks: false,
            selectedTid: undefined,
        };
    }

    randomTask() {
        return {
            title: 'Random task',
            dueDate: 'asap',
            priority: 1,
        };
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
                <AppBar position="relative" color="primary">
                    <Toolbar variant="dense">
                        <FormControl>
                            <FormControlLabel
                                control={<Switch color="default" />}
                                label={this.state.showingCompletedTasks ? 'Completed tasks' : 'Remaining tasks'}
                                value={this.state.showingCompletedTasks}
                                onChange={this.toggleCompletedTasks}
                            />
                        </FormControl>
                    </Toolbar>
                </AppBar>
                <Fab className="add-button" color="secondary" onClick={() => this.props.createTask(this.randomTask())}>
                    <AddIcon />
                </Fab>
            </div>
        );
    }
}

TasksList.propTypes = {
    tids: PropTypes.array,
    getTask: PropTypes.func,
    fetchTasks: PropTypes.func,
    createTask: PropTypes.func,
    deleteTask: PropTypes.func,
    onTaskSelected: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getTasksSelectors(state.tasks);

    return {
        tids: getTasksSelectors(state.tasks).selectIds(),
        getTask: selectors.selectById,
    };
};

const mapDispatchToProps = { fetchTasks, createTask, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
