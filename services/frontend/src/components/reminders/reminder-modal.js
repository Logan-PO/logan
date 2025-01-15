import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from 'packages/core';
import {
    getRemindersSelectors,
    createReminder,
    updateReminder,
    updateReminderLocal,
} from 'packages/fe-shared/store/reminders';
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
import { DateTimePicker } from '@material-ui/pickers';
import classes from './reminder-modal.module.scss';

class ReminderModal extends React.Component {
    constructor(props) {
        super(props);

        this.setStateSync = this.setStateSync.bind(this);
        this.confirm = this.confirm.bind(this);

        this.state = {
            isInitialPass: true,
            showLoader: false,
            reminder: undefined,
            isCreating: false,
        };
    }

    async setStateSync(updates) {
        return new Promise((resolve, reject) => {
            try {
                this.setState(updates, resolve);
            } catch (e) {
                reject(e);
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.componentWillOpen();
        } else if (this.state.justOpened) {
            this.componentDidOpen();
        }
    }

    componentWillOpen() {
        let reminder;

        if (this.props.mode === 'edit') {
            reminder = this.props.getReminder(this.props.rid);
        } else {
            const now = dateUtils.toDateTime(dateUtils.dayjs());
            const minutes = Math.ceil(now.minute() / 15) * 15;
            const reminderTS = now.minute(minutes);

            reminder = {
                message: '',
                eid: this.props.eid,
                entityType: this.props.entityType,
                timestamp: dateUtils.formatAsDateTime(reminderTS),
            };
        }

        this.setState({
            reminder,
            showLoader: false,
            isInitialPass: this.props.mode === 'create',
        });
    }

    componentDidOpen() {
        this.setState({
            validationErrors: {},
        });
    }

    async handleUpdate(prop, e) {
        const changes = {};

        if (prop === 'message') {
            changes.message = e.target.value;
        } else if (prop === 'timestamp') {
            changes.timestamp = dateUtils.formatAsDateTime(e);
        }

        const updated = _.merge({}, this.state.reminder, changes);
        await this.setStateSync({ reminder: updated });

        if (!this.state.isInitialPass) this.validateContent();
    }

    async validateContent() {
        const validationErrors = {};

        if (_.isEmpty(_.get(this.state.reminder, 'message', '').trim())) {
            validationErrors.message = true;
        }

        if (
            _.get(this.state.reminder, 'timestamp') &&
            dateUtils.toDateTime(this.state.reminder.timestamp).isSameOrBefore(dateUtils.dayjs(), 'minute')
        ) {
            validationErrors.timestamp = true;
        }

        return this.setStateSync({ validationErrors });
    }

    async confirm() {
        await this.setStateSync({ isInitialPass: false });
        await this.validateContent();

        if (!_.isEmpty(this.state.validationErrors)) return;

        const id = setTimeout(() => this.setState({ showLoader: true }), 500);

        if (this.props.mode === 'create') {
            await this.props.createReminder(this.state.reminder);
        } else if (this.props.mode === 'edit') {
            this.props.updateReminderLocal({
                id: this.props.rid,
                changes: this.state.reminder,
            });
            await this.props.updateReminder(this.state.reminder);
        }

        clearTimeout(id);
        this.setState({ showLoader: false, isCreating: false });
        this.props.onClose();
    }

    render() {
        const title = this.props.mode === 'edit' ? 'Edit Reminder' : 'Create Reminder';
        const actionName = this.props.mode === 'edit' ? 'Save' : 'Create';

        const messageError = _.get(this.state, ['validationErrors', 'message'], false);
        const timestampError = _.get(this.state, ['validationErrors', 'timestamp'], false);

        return (
            <Dialog
                open={this.props.open}
                fullWidth
                maxWidth="sm"
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
                onClose={this.props.onClose}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                label="Message"
                                fullWidth
                                error={messageError}
                                helperText={messageError && 'Message cannot be empty'}
                                value={_.get(this.state.reminder, 'message', '')}
                                onChange={this.handleUpdate.bind(this, 'message')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <DateTimePicker
                                variant="inline"
                                label="Send at…"
                                fullWidth
                                minutesStep={15}
                                disablePast
                                error={timestampError}
                                helperText={timestampError && 'Must be in the future'}
                                labelFunc={date => {
                                    const relative = dateUtils.humanReadableDate(date);
                                    const time = date.format('h:mm A');
                                    return `${relative} at ${time}`;
                                }}
                                value={_.get(this.state.reminder, 'timestamp')}
                                onChange={this.handleUpdate.bind(this, 'timestamp')}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>Cancel</Button>
                    <div className={classes.wrapper}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.confirm}
                            disabled={!_.isEmpty(this.state.validationErrors)}
                        >
                            {actionName}
                        </Button>
                        {this.state.showLoader && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

ReminderModal.propTypes = {
    entityType: PropTypes.string,
    eid: PropTypes.string,
    open: PropTypes.bool,
    rid: PropTypes.string,
    getReminder: PropTypes.func,
    mode: PropTypes.string,
    onClose: PropTypes.func,
    createReminder: PropTypes.func,
    updateReminder: PropTypes.func,
    updateReminderLocal: PropTypes.func,
};

ReminderModal.defaultProps = {
    open: false,
    mode: 'create',
};

const mapStateToProps = state => ({
    getReminder: getRemindersSelectors(state.reminders).selectById,
});

const mapDispatchToProps = {
    createReminder,
    updateReminder,
    updateReminderLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReminderModal);
