import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Page } from '../shared';
import { fetchTasks } from '../../store/tasks';
import api from '../../utils/api';
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
        api.setBearerToken(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJmYWJiMDQyZi05NjU2LTRjMjAtYmYzMy1hZmM5MDMzN2E1ZTEiLCJpYXQiOjE2MDE4NDM3OTB9.oaMx3ATdIOYikkdMPI4f8lnAIcS0z5hAaP6hODOQUC8'
        );
        this.props.fetchTasks();
    }

    didSelectTask(tid) {
        this.setState({ selectedTid: tid });
    }

    render() {
        return (
            <Page title="Tasks">
                <div className={styles.tasksPage}>
                    <TasksList onTaskSelected={this.didSelectTask} />
                    <TaskEditor tid={this.state.selectedTid} />
                </div>
            </Page>
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
