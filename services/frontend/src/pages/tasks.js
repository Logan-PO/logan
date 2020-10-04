import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createTask, deleteTask } from '../store/tasks';

const TasksPage = ({ tasks, createTask, deleteTask }) => {
    return (
        <div>
            <h1>Tasks Page</h1>
            <button onClick={() => createTask({ tid: Math.random() })}>Create Task</button>
            <ul>
                {tasks.map((task) => (
                    <li key={task.tid}>
                        {task.tid}
                        <button onClick={() => deleteTask(task)}>-</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

TasksPage.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.object),
    createTask: PropTypes.func,
    deleteTask: PropTypes.func,
};

const mapStateToProps = (state) => ({
    tasks: state.tasks.tasks,
});

const mapDispatchToProps = { createTask, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);
