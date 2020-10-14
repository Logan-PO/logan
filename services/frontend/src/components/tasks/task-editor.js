import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@material-ui/core';
import UpdateTimer from '../../utils/update-timer';
import { getTasksSelectors, updateTaskLocal, updateTask, deleteTask } from '../../store/tasks';
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

        this.state = {
            task: undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            // If the user has selected a new task and updates to the existing task haven't been saved yet, save them
            if (prevProps.tid && this.changesExist) {
                const prevTask = this.props.selectTask(prevProps.tid);

                if (prevTask) this.updateTimer.fire();

                this.updateTimer.stop();
            }

            this.setState({
                task: this.props.selectTask(this.props.tid),
            });
        } else {
            // Also if the task has been updated somewhere else, make sure the state reflects that
            const storeTask = this.props.selectTask(this.props.tid);
            if (!_.isEqual(storeTask, this.state.task)) {
                this.setState({ task: storeTask });
            }
        }
    }

    handleChange(prop, e) {
        this.changesExist = true;

        const changes = {};

        changes[prop] = e.target.value;

        this.props.updateTaskLocal({
            id: this.props.tid,
            changes,
        });

        this.setState({
            task: _.merge({}, this.state.task, changes),
        });

        this.updateTimer.reset();
    }
    /*class: 'PHYS',
    name: 'Random Assignment',
    desc: 'test',
    dueDate: 'soon',
    color: 'orange',
    id: 1,*/
    render() {
        return (
            <div className={styles.taskEditor}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            label="Title"
                            fullWidth
                            onChange={this.handleChange.bind(this, 'title')}
                            value={_.get(this.state.task, 'title', '')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            onChange={this.handleChange.bind(this, 'description')}
                            value={_.get(this.state.task, 'description', '')}
                        />
                    </Grid>
                </Grid>
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
