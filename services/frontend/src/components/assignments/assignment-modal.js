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
import { DatePicker } from '@material-ui/pickers';
import { CoursePicker } from '../shared/controls';
import { createAssignment } from '../../store/assignments';
import styles from '../tasks/task-modal.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class AssignmentModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.createAssignment = this.createAssignment.bind(this);

        this.state = {
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            assignment: {
                title: 'New assignment',
                dueDate: dayjs().format(DB_DATE_FORMAT),
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.componentWillOpen();
        }
    }

    componentWillOpen() {
        this.setState({
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            assignment: {
                title: 'New assignment',
                dueDate: dayjs().format(DB_DATE_FORMAT),
            },
        });
    }

    close() {
        this.props.onClose();
    }

    async createAssignment() {
        this.setState({ isCreating: true });
        const id = setTimeout(() => this.setState({ showLoader: true }), 500);
        await this.props.createAssignment(this.state.assignment);
        clearTimeout(id);
        this.setState({ showLoader: false, isCreating: false });
        this.props.onClose();
    }

    handleChange(prop, e) {
        const assignment = this.state.assignment;

        if (prop === 'dueDate') {
            assignment[prop] = e.format(DB_DATE_FORMAT);
        } else if (prop === 'cid') {
            const cid = e.target.value;
            if (cid === 'none') assignment[prop] = undefined;
            else assignment[prop] = e.target.value;
        } else {
            assignment[prop] = e.target.value;
        }

        this.setState({ assignment });
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
                maxWidth="sm"
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
            >
                <DialogTitle>New Assignment</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                label="Title"
                                onChange={this.handleChange.bind(this, 'title')}
                                value={_.get(this.state.assignment, 'title')}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                multiline
                                onChange={this.handleChange.bind(this, 'description')}
                                value={_.get(this.state.assignment, 'description')}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <CoursePicker
                                        value={_.get(this.state.assignment, 'cid', 'none')}
                                        onChange={this.handleChange.bind(this, 'cid')}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DatePicker
                                        value={dayjs(_.get(this.state.assignment, 'dueDate'))}
                                        onChange={this.handleChange.bind(this, 'dueDate')}
                                        variant="inline"
                                        label="Due Date"
                                        fullWidth
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
                            onClick={this.createAssignment}
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

AssignmentModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    createAssignment: PropTypes.func,
};

export default connect(null, { createAssignment })(AssignmentModal);
