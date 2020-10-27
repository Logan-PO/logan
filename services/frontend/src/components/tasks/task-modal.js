import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    TextField,
    DialogActions,
    Button,
    CircularProgress,
} from '@material-ui/core';
import { CoursePicker, DueDatePicker, PriorityPicker } from '../shared/controls';
import { createTask } from '../../store/tasks';
import styles from './task-modal.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class TaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.createTask = this.createTask.bind(this);

        const newTitle = props.aid ? 'New subtask' : 'New task';

        this.state = {
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            task: {
                aid: props.aid,
                title: newTitle,
                dueDate: dayjs().format(DB_DATE_FORMAT),
                priority: 0,
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.componentWillOpen();
        }
    }

    componentWillOpen() {
        const newTitle = this.props.aid ? 'New subtask' : 'New task';

        this.setState({
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            task: {
                aid: this.props.aid,
                title: newTitle,
                dueDate: dayjs().format(DB_DATE_FORMAT),
                priority: 0,
            },
        });
    }

    close() {
        this.props.onClose();
    }

    async createTask() {
        this.setState({ isCreating: true });
        const id = setTimeout(() => this.setState({ showLoader: true }), 500);
        await this.props.createTask(this.state.task);
        clearTimeout(id);
        this.setState({ showLoader: false, isCreating: false });
        this.props.onClose();
    }

    handleChange(prop, e) {
        const task = this.state.task;

        if (prop === 'dueDate') {
            task[prop] = e;
        } else if (prop === 'cid') {
            const cid = e.target.value;
            if (cid === 'none') task[prop] = undefined;
            else task[prop] = e.target.value;
        } else {
            task[prop] = e.target.value;
        }

        this.setState({ task });
    }

    render() {
        const isSubtask = !!this.props.aid;

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
                maxWidth="sm"
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
            >
                <DialogTitle>{isSubtask ? 'New subtask' : 'New Task'}</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                onChange={this.handleChange.bind(this, 'title')}
                                value={_.get(this.state.task, 'title')}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                multiline
                                onChange={this.handleChange.bind(this, 'description')}
                                value={_.get(this.state.task, 'description')}
                                fullWidth
                            />
                        </Grid>
                        {!isSubtask && (
                            <Grid item xs={12}>
                                <CoursePicker
                                    value={_.get(this.state.task, 'cid', 'none')}
                                    onChange={this.handleChange.bind(this, 'cid')}
                                    fullWidth
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2} style={{ marginTop: 4 }}>
                                <Grid item xs={6}>
                                    <DueDatePicker
                                        entityId={this.state.fakeId}
                                        value={_.get(this.state.task, 'dueDate')}
                                        onChange={this.handleChange.bind(this, 'dueDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <PriorityPicker
                                        value={_.get(this.state.task, 'priority')}
                                        onChange={this.handleChange.bind(this, 'priority')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.close} disableElevation>
                        Cancel
                    </Button>
                    <div className={styles.wrapper}>
                        <Button
                            onClick={this.createTask}
                            variant="contained"
                            color="primary"
                            disabled={this.state.showLoader}
                            disableElevation
                        >
                            Create
                        </Button>
                        {this.state.showLoader && <CircularProgress size={24} className={styles.buttonProgress} />}
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

TaskModal.propTypes = {
    aid: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    createTask: PropTypes.func,
};

export default connect(null, { createTask })(TaskModal);
