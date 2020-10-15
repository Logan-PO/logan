import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import {
    Grid,
    TextField,
    Checkbox,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
} from '@material-ui/core';
import UpdateTimer from '../../utils/update-timer';
import { getTasksSelectors, updateTaskLocal, updateTask, deleteTask } from '../../store/tasks';
import styles from './task-editor.module.scss';

const { dayjs, constants: dateConstants } = dateUtils;

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

    isEmpty() {
        return _.isEmpty(this.props.tid);
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
            }

            const currentTask = this.props.selectTask(this.props.tid);
            this.updateCurrentTask(currentTask);
            if (currentTask.dueDate !== 'asap' && currentTask.dueDate !== 'eventually') {
                this.setState({ lastDueDate: dayjs(currentTask.dueDate, dateConstants.DB_DATE_FORMAT) });
            }
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

            this.makeChanges({ dueDate: lastDueDate.format(dateConstants.DB_DATE_FORMAT) });
        } else {
            this.makeChanges({ dueDate: newType });
        }
    }

    handleChange(prop, e) {
        this.changesExist = true;

        const changes = {};

        if (prop === 'complete') {
            changes[prop] = e.target.checked;
        } else if (prop === 'dueDate') {
            const dateString = e.target.value;
            const dateObj = dayjs(dateString, 'YYYY-MM-DD');
            this.setState({ lastDueDate: dateObj });
            changes[prop] = dateObj.format(dateConstants.DB_DATE_FORMAT);
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
                        <FormControl disabled={this.isEmpty()}>
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
                        <FormControl disabled={this.isEmpty()}>
                            <FormLabel color="secondary">Priority</FormLabel>
                            <RadioGroup
                                name="priority"
                                value={_.get(this.state.task, 'priority', '')}
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
