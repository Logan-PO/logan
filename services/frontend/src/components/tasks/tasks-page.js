import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTasks } from '@logan/fe-shared/store/tasks';
import { Page } from '../shared';
import EmptySticker from '../shared/displays/empty-sticker';
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
                <div className={styles.tasksPage}>
                    <div className={styles.tasksListContainer}>
                        <TasksList onTaskSelected={this.didSelectTask} />
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.taskEditorContainer}>
                        {this.state.selectedTid ? (
                            <TaskEditor tid={this.state.selectedTid} />
                        ) : (
                            <EmptySticker message="Nothing selected" />
                        )}
                    </div>
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
