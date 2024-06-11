import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from '@logan/core';
import {
    getRemindersSelectors,
    createReminder,
    updateReminder,
    updateReminderLocal,
} from '@logan/fe-shared/store/reminders';
import { Grid, CircularProgress } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';
import Dialog from '../shared/dialog';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import ActionButton from '../shared/controls/action-button';
import TimePicker from '../shared/controls/time-picker';
import BasicDatePicker from '../shared/controls/basic-date-picker';
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
        } else if (prop === 'date') {
            const time = dateUtils.formatAsTime(dateUtils.toDateTime(this.state.reminder.timestamp));
            changes.timestamp = `${dateUtils.formatAsDate(e)} ${time}`;
        } else if (prop === 'time') {
            const date = dateUtils.formatAsDate(dateUtils.toDateTime(this.state.reminder.timestamp));
            changes.timestamp = `${date} ${dateUtils.formatAsTime(e)}`;
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
        const title = this.props.mode === 'edit' ? 'Edit reminder' : 'New reminder';
        const actionName = this.props.mode === 'edit' ? 'Save' : 'Create';

        const messageError = _.get(this.state, ['validationErrors', 'message'], false);
        const timestampError = _.get(this.state, ['validationErrors', 'timestamp'], false);

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                title={title}
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
                content={
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs={12}>
                            <Grid item xs={12}>
                                <InputGroup
                                    fullWidth
                                    style={{ marginBottom: 8 }}
                                    classes={{ accessoryCell: classes.alignTop }}
                                    icon={MessageIcon}
                                    label="Message"
                                    error={messageError}
                                    helperText={messageError ? "Can't send an empty reminder!" : undefined}
                                    content={
                                        <TextInput
                                            autoFocus
                                            fullWidth
                                            multiline
                                            placeholder="Message content…"
                                            value={_.get(this.state.reminder, 'message', '')}
                                            onChange={this.handleUpdate.bind(this, 'message')}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <BasicDatePicker
                                        inputGroupProps={{
                                            label: 'Date',
                                            error: timestampError,
                                            helperText: timestampError ? 'Must be in the future' : undefined,
                                        }}
                                        value={dateUtils.toDateTime(_.get(this.state, 'reminder.timestamp'))}
                                        onChange={this.handleUpdate.bind(this, 'date')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TimePicker
                                        value={dateUtils.toDateTime(_.get(this.state, 'reminder.timestamp'))}
                                        onChange={this.handleUpdate.bind(this, 'time')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                cancelTitle="Cancel"
                actions={
                    <React.Fragment>
                        {this.state.showLoader ? (
                            <CircularProgress size={24} className={classes.buttonProgress} />
                        ) : (
                            <ActionButton onClick={this.confirm} disabled={!_.isEmpty(this.state.validationErrors)}>
                                {actionName}
                            </ActionButton>
                        )}
                    </React.Fragment>
                }
            />
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
