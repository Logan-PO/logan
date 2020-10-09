import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTasks } from '../../store/tasks';
import TasksList from './tasks-list';
import TaskEditor from './task-editor';
import styles from './tasks-page.module.scss';

class TasksPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTid: undefined,
        };

        this.didSelectTask = this.didSelectTask.bind(this);
    }

    componentDidMount() {
        this.props.fetchTasks();
    }

    didSelectTask(tid) {
        this.setState({ selectedTid: tid });
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
                    <TaskEditor tid={this.state.selectedTid} />
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
