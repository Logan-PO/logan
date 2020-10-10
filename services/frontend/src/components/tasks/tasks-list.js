import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getTasksSelectors, fetchTasks, createTask, deleteTask, compareDueDates } from '../../store/tasks';
import TaskCell from './task-cell';
import styles from './tasks-list.module.scss';

class TasksList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectTask = this.didSelectTask.bind(this);
        this.didDeleteTask = this.didDeleteTask.bind(this);

        this.state = {
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

    render() {
        return (
            <div className={styles.tasksList}>
                <div className={styles.scrollview}>
                    <List>
                        {this.props.sections.map(section => {
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
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchTasks: PropTypes.func,
    createTask: PropTypes.func,
    deleteTask: PropTypes.func,
    onTaskSelected: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getTasksSelectors(state.tasks);
    const sections = {};
    for (const task of selectors.selectAll()) {
        if (sections[task.dueDate]) sections[task.dueDate].push(task.tid);
        else sections[task.dueDate] = [task.tid];
    }

    return {
        sections: Object.entries(sections).sort((a, b) => compareDueDates(a[0], b[0])),
    };
};

const mapDispatchToProps = { fetchTasks, createTask, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
