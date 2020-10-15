import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, TextField, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import dayjs from 'dayjs';
import UpdateTimer from '../../utils/update-timer';
import { getTasksSelectors, updateTaskLocal, updateTask, deleteTask } from '../../store/tasks';
import styles from './task-editor.module.scss';

const priorities = {
    'Very low': -2,
    Low: -1,
    Normal: 0,
    High: 1,
    'Very high': 2,
};

class TaskEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.updateDueDateType = this.updateDueDateType.bind(this);

        this.changesExist = false;
        this.updateTimer = new UpdateTimer(1000, () => {
            this.props.updateTask(this.state.task);
            this.changesExist = false;
        });

        this.state = {};
    }

    updateCurrentTask(task) {
        let dueDateType = _.get(task, 'dueDate');
        if (dueDateType !== 'asap' && dueDateType !== 'eventually') {
            dueDateType = 'date';
        }

        this.setState({
            task,
            dueDateType,
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            // If the user has selected a new task and updates to the existing task haven't been saved yet, save them
            if (prevProps.tid && this.changesExist) {
                const prevTask = this.props.selectTask(prevProps.tid);

                if (prevTask) this.updateTimer.fire();

                this.updateTimer.stop();
                this.setState({ lastDueDate: dayjs() });
            }

            this.updateCurrentTask(this.props.selectTask(this.props.tid));
        } else {
            // Also if the task has been updated somewhere else, make sure the state reflects that
            const storeTask = this.props.selectTask(this.props.tid);
            if (!_.isEqual(storeTask, this.state.task)) {
                this.updateCurrentTask(storeTask);
            }
        }
    }

    updateDueDateType(e) {
        const newType = e.target.value;

        this.changesExist = true;

        if (newType === 'date') {
            let lastDueDate = this.state.lastDueDate;
            if (!this.state.lastDueDate) {
                lastDueDate = dayjs();
                this.setState({ lastDueDate });
            }

            this.makeChanges({ dueDate: lastDueDate.format('M/D/YYYY') });
        } else {
            this.makeChanges({ dueDate: newType });
        }
    }

    handleChange(prop, e) {
        this.changesExist = true;

        const changes = {};

        if (prop === 'dueDate') {
            const dateString = e.target.value;
            const dateObj = dayjs(dateString, 'YYYY-MM-DD');
            this.setState({ lastDueDate: dateObj });
            changes[prop] = dateObj.format('M/D/YYYY');
        } else {
            changes[prop] = e.target.value;
        }

        this.makeChanges(changes);
    }

    makeChanges(changes) {
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
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            label="Title"
                            fullWidth
                            onChange={this.handleChange.bind(this, 'title')}
                            value={_.get(this.state.task, 'title', '')}
                            color="secondary"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            onChange={this.handleChange.bind(this, 'description')}
                            value={_.get(this.state.task, 'description', '')}
                            color="secondary"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel color="secondary">Due Date</FormLabel>
                            <RadioGroup
                                name="dueDateType"
                                value={_.get(this.state, 'dueDateType', '')}
                                onChange={this.updateDueDateType}
                            >
                                <FormControlLabel
                                    value="asap"
                                    label="ASAP"
                                    labelPlacement="end"
                                    control={<Radio color="secondary" />}
                                />
                                <FormControlLabel
                                    value="eventually"
                                    label="Eventually"
                                    labelPlacement="end"
                                    control={<Radio color="secondary" />}
                                />
                                <FormControlLabel
                                    value="date"
                                    label={
                                        <TextField
                                            type="date"
                                            disabled={_.get(this.state, 'dueDateType') !== 'date'}
                                            value={_.get(this.state, 'lastDueDate', dayjs()).format('YYYY-MM-DD')}
                                            onChange={this.handleChange.bind(this, 'dueDate')}
                                            color="secondary"
                                        />
                                    }
                                    labelPlacement="end"
                                    control={<Radio color="secondary" />}
                                />
                            </RadioGroup>
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormLabel color="secondary">Priority</FormLabel>
                            <RadioGroup
                                name="priority"
                                value={_.get(this.state.task, 'priority', 0)}
                                onChange={this.handleChange.bind(this, 'priority')}
                            >
                                {_.entries(priorities).map(([pName, p]) => (
                                    <FormControlLabel
                                        key={pName}
                                        value={p}
                                        label={pName}
                                        labelPlacement="end"
                                        control={<Radio color="secondary" />}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
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
