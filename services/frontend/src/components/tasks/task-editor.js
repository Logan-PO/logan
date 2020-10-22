import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, TextField, Checkbox } from '@material-ui/core';
import UpdateTimer from '../../utils/update-timer';
import { getTasksSelectors, updateTaskLocal, updateTask, deleteTask } from '../../store/tasks';
import { CoursePicker, DueDatePicker, PriorityPicker } from '../shared/controls';
import styles from './task-editor.module.scss';

class TaskEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.changesExist = false;
        this.updateTimer = new UpdateTimer(1000, () => {
            this.props.updateTask(this.state.task);
            this.changesExist = false;
        });

        this.state = {};
    }

    isEmpty() {
        return _.isEmpty(this.props.tid);
    }

    updateCurrentTask(task) {
        this.setState({
            task,
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            // If the user has selected a new task and updates to the existing task haven't been saved yet, save them
            if (prevProps.tid && this.changesExist) {
                const prevTask = this.props.selectTask(prevProps.tid);

                if (prevTask) this.updateTimer.fire();

                this.updateTimer.stop();
            }

            const currentTask = this.props.selectTask(this.props.tid);
            this.updateCurrentTask(currentTask);
        } else {
            // Also if the task has been updated somewhere else, make sure the state reflects that
            const storeTask = this.props.selectTask(this.props.tid);
            if (!_.isEqual(storeTask, this.state.task)) {
                this.updateCurrentTask(storeTask);
            }
        }
    }

    handleChange(prop, e) {
        this.changesExist = true;

        const changes = {};

        if (prop === 'complete') {
            changes[prop] = e.target.checked;
        } else if (prop === 'dueDate') {
            changes[prop] = e;
        } else if (prop === 'cid') {
            const cid = e.target.value;
            if (cid === 'none') changes[prop] = undefined;
            else changes[prop] = e.target.value;
        } else {
            changes[prop] = e.target.value;
        }

        this.props.updateTaskLocal({
            id: this.props.tid,
            changes,
        });

        this.updateCurrentTask(_.merge({}, this.state.task, changes));

        this.updateTimer.reset();
    }

    render() {
        return (
            <div className={styles.taskEditor}>
                <div className={styles.scrollview}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end">
                                <Grid item>
                                    <Checkbox
                                        style={{ padding: 0 }}
                                        disabled={this.isEmpty()}
                                        checked={_.get(this.state.task, 'complete', false)}
                                        onChange={this.handleChange.bind(this, 'complete')}
                                    />
                                </Grid>
                                <Grid item style={{ flexGrow: 1 }}>
                                    <TextField
                                        label="Title"
                                        fullWidth
                                        onChange={this.handleChange.bind(this, 'title')}
                                        value={_.get(this.state.task, 'title', '')}
                                        color="secondary"
                                        placeholder="Untitled task"
                                        disabled={this.isEmpty()}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                onChange={this.handleChange.bind(this, 'description')}
                                value={_.get(this.state.task, 'description', '')}
                                color="secondary"
                                placeholder="Task description"
                                disabled={this.isEmpty()}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CoursePicker
                                disabled={this.isEmpty()}
                                value={_.get(this.state.task, 'cid', 'none')}
                                onChange={this.handleChange.bind(this, 'cid')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2} style={{ marginTop: 4 }}>
                                <Grid item>
                                    <DueDatePicker
                                        entityId={_.get(this.state.task, 'tid')}
                                        disabled={this.isEmpty()}
                                        value={_.get(this.state.task, 'dueDate')}
                                        onChange={this.handleChange.bind(this, 'dueDate')}
                                    />
                                </Grid>
                                <Grid item>
                                    <PriorityPicker
                                        disabled={this.isEmpty()}
                                        value={_.get(this.state.task, 'priority')}
                                        onChange={this.handleChange.bind(this, 'priority')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

TaskEditor.propTypes = {
    tid: PropTypes.string,
    updateTaskLocal: PropTypes.func,
    selectTask: PropTypes.func,
    updateTask: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectTask: getTasksSelectors(state.tasks).selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(TaskEditor);
