import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTasks, createTask, deleteTask } from '../store/tasks';
import api from '../utils/api';

class TasksPage extends React.Component {
    componentDidMount() {
        api.setBearerToken(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJmYWJiMDQyZi05NjU2LTRjMjAtYmYzMy1hZmM5MDMzN2E1ZTEiLCJpYXQiOjE2MDE4NDM3OTB9.oaMx3ATdIOYikkdMPI4f8lnAIcS0z5hAaP6hODOQUC8'
        );
        this.props.fetchTasks();
    }

    randomTask() {
        return {
            title: 'Random task',
            dueDate: 'asap',
            priority: 1,
        };
    }

    render() {
        return (
            <div>
                <h1>Tasks Page</h1>
                <button onClick={this.props.fetchTasks}>Fetch</button>
                <button onClick={() => this.props.createTask(this.randomTask())}>Create Task</button>
                <ul>
                    {this.props.tasks.map(task => (
                        <li key={task.tid}>
                            {task.tid}
                            <button onClick={() => this.props.deleteTask(task)}>-</button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

TasksPage.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.object),
    fetchTasks: PropTypes.func,
    createTask: PropTypes.func,
    deleteTask: PropTypes.func,
};

const mapStateToProps = state => ({
    tasks: state.tasks.tasks,
});

const mapDispatchToProps = { fetchTasks, createTask, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);
