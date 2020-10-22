import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from '@logan/core';
import { List, ListSubheader, AppBar, Toolbar, FormControl, FormControlLabel, Switch, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getTasksSelectors, fetchTasks, createTask, deleteTask, compareDueDates } from '../../store/tasks';
import TaskCell from './task-cell';
import styles from './tasks-list.module.scss';

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

    sectionsToShow() {
        const tasks = this.props.tids
            .map(tid => this.props.getTask(tid))
            .filter(task => task.complete === this.state.showingCompletedTasks);

        const sections = {};
        for (const task of tasks) {
            const key = dateUtils.dueDateIsDate(task.dueDate) ? dateUtils.dayjs(task.dueDate) : task.dueDate;
            if (sections[key]) sections[key].push(task.tid);
            else sections[key] = [task.tid];
        }

        if (this.state.showingCompletedTasks) {
            return _.entries(sections)
                .sort((a, b) => compareDueDates(b[0], a[0]))
                .map(([key, value]) => [dateUtils.readableDueDate(key), value]);
        } else {
            return _.entries(sections)
                .sort((a, b) => compareDueDates(a[0], b[0]))
                .map(([key, value]) => [dateUtils.readableDueDate(key), value]);
        }
    }

    render() {
        const sections = this.sectionsToShow();

        return (
            <div className={styles.tasksList}>
                <div className={styles.scrollview}>
                    <List>
                        {sections.map(section => {
                            const [dueDate, tids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <ListSubheader className={styles.heading}>{dueDate}</ListSubheader>
                                    {tids.map(tid => (
                                        <TaskCell
                                            key={tid}
                                            tid={tid}
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
                <Fab
                    className={styles.addButton}
                    color="secondary"
                    onClick={() => this.props.createTask(this.randomTask())}
                >
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
