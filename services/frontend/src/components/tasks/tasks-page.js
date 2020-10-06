import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import { fetchTasks } from '../../store/tasks';
import TasksList from './tasks-list';
import styles from './tasks-page.module.scss';

class TasksPage extends React.Component {
    componentDidMount() {
        api.setBearerToken(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJmYWJiMDQyZi05NjU2LTRjMjAtYmYzMy1hZmM5MDMzN2E1ZTEiLCJpYXQiOjE2MDE4NDM3OTB9.oaMx3ATdIOYikkdMPI4f8lnAIcS0z5hAaP6hODOQUC8'
        );
        this.props.fetchTasks();
    }

    render() {
        return (
            <div className={styles.page}>
                <div className={styles.navbar}>
                    <h2>Logan / Tasks</h2>
                </div>
                <div className={styles.tasksPage}>
                    <div className={styles.sidebar}></div>
                    <TasksList />
                    <div className={styles.taskEditor}></div>
                </div>
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

const mapDispatchToProps = { fetchTasks };

export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);
