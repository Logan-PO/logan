import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTasks, createTask } from '../../store/tasks';
import styles from './tasks-list.module.scss';
import TaskCell from './task-cell';

class TasksList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectTask = this.didSelectTask.bind(this);

        this.state = {
            selectedTask: undefined,
        };
    }

    randomTask() {
        return {
            title: 'Random task',
            dueDate: 'asap',
            priority: 1,
        };
    }

    didSelectTask(task) {
        this.setState(() => ({ selectedTask: task.tid }));
        this.props.onTaskSelected(task.tid);
    }

    render() {
        return (
            <div className={styles.tasksList}>
                <div className={styles.scrollview}>
                    {this.props.sections.map(section => {
                        const [dueDate, tasks] = section;
                        return (
                            <React.Fragment key={section[0]}>
                                <div className={styles.heading}>{dueDate}</div>
                                {tasks.map(task => (
                                    <TaskCell
                                        key={task.tid}
                                        task={task}
                                        onSelect={this.didSelectTask}
                                        selected={this.state.selectedTask === task.tid}
                                    />
                                ))}
                            </React.Fragment>
                        );
                    })}
                </div>
                <div className={styles.buttonBar}>
                    <button onClick={this.props.fetchTasks}>Fetch</button>
                    <button onClick={() => this.props.createTask(this.randomTask())}>New</button>
                </div>
            </div>
        );
    }
}

TasksList.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchTasks: PropTypes.func,
    createTask: PropTypes.func,
    onTaskSelected: PropTypes.func,
};

const mapStateToProps = state => {
    const sections = {};
    for (const task of _.values(state.tasks.entities)) {
        if (sections[task.dueDate]) sections[task.dueDate].push(task);
        else sections[task.dueDate] = [task];
    }

    return {
        sections: Object.entries(sections),
    };
};

const mapDispatchToProps = { fetchTasks, createTask };

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
