import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import { fetchTasks } from '../../store/tasks';
import TasksList from './tasks-list';
import TaskEditor from './task-editor';
import styles from './tasks-page.module.scss';

class TasksPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTask: undefined,
        };

        this.didSelectTask = this.didSelectTask.bind(this);
    }

    componentDidMount() {
        api.setBearerToken(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJmYWJiMDQyZi05NjU2LTRjMjAtYmYzMy1hZmM5MDMzN2E1ZTEiLCJpYXQiOjE2MDE4NDM3OTB9.oaMx3ATdIOYikkdMPI4f8lnAIcS0z5hAaP6hODOQUC8'
        );
        this.props.fetchTasks();
    }

    didSelectTask(task) {
        this.setState({ selectedTask: task });
    }

    render() {
        return (
            <div className={styles.page}>
                <div className={styles.navbar}>
                    <h2>Logan / Tasks</h2>
                </div>
                <div className={styles.tasksPage}>
                    <div className={styles.sidebar}></div>
                    <TasksList onTaskSelected={this.didSelectTask} />
                    <TaskEditor tid={this.state.selectedTask} />
                </div>
            </div>
        );
    }
}

TasksPage.propTypes = {
    fetchTasks: PropTypes.func,
    createTask: PropTypes.func,
    deleteTask: PropTypes.func,
};

const mapDispatchToProps = { fetchTasks };

export default connect(null, mapDispatchToProps)(TasksPage);
