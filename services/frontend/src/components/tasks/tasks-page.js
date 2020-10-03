import React from 'react';
import { connect } from 'react-redux';
import { createTask } from '../../store/tasks';

const TasksPage = ({ tasks, createTask }) => (
    <div>
        <h1>Tasks Page</h1>
        <button onClick={() => createTask({ id: Math.random() })}>Create Task</button>
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>{task.id}</li>
            ))}
        </ul>
    </div>
);

const mapStateToProps = (state) => ({
    tasks: state.tasks,
});

const mapDispatchToProps = { createTask };

export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);
