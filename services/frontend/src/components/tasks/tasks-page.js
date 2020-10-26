import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Page } from '../shared';
import { fetchTasks } from '../../store/tasks';
import TasksList from './tasks-list';
import TaskEditor from './task-editor';
import styles from './tasks-page.module.scss';

class TasksPage extends React.Component {
    constructor(props) {
        super(props);
        this.didSelectTask = this.didSelectTask.bind(this);

        this.state = { selectedTid: undefined };
    }

    didSelectTask(tid) {
        this.setState({ selectedTid: tid });
    }

    render() {
        return (
            <Page title="Tasks">
                <Grid container spacing={0} className={styles.tasksPage}>
                    <Grid item sm={6} md={4} lg={5} className={styles.tasksListContainer}>
                        <TasksList onTaskSelected={this.didSelectTask} />
                    </Grid>
                    <Grid item sm={6} md={8} lg={7} className={styles.taskEditorContainer}>
                        <TaskEditor tid={this.state.selectedTid} />
                    </Grid>
                </Grid>
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
