import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import ListItem from '../shared/list-item';
import DueDateControl from '../shared/due-date-control';
import TimePicker from '../shared/pickers/time-picker';
import Typography from '../shared/typography';
import Editor from 'packages/fe-shared/components/editor';
import { getRemindersSelectors } from 'packages/fe-shared/store/reminders';
import { dateUtils } from 'packages/core';

class ReminderEditor extends Editor {
    constructor(props) {
        super(props, { id: 'rid', entity: 'reminder', mobile: true, manualSave: true });

        let reminder;

        if (props.mode === Editor.Mode.Create) {
            const now = dateUtils.dayjs();
            const minutesFloored = Math.floor(now.minute() / 15) * 15;
            const reminderTS = now.startOf('hour').minute(minutesFloored).add(15, 'minute');

            reminder = {
                title: '',
                eid: props.route.params.eid,
                entityType: props.route.params.entityType,
                timestamp: dateUtils.formatAsDateTime(reminderTS),
                message: '',
            };
        } else {
            reminder = props.getReminder(props.route.params.rid);
        }

        this.state = { reminder };
    }

    selectEntity(id) {
        return this.props.getReminder(id);
    }

    updateEntityLocal() {}

    updateEntity() {}

    processChange(changes, prop, e) {
        if (prop === 'date') {
            const time = dateUtils.formatAsTime(dateUtils.toDateTime(this.state.reminder.timestamp));
            changes.timestamp = `${e} ${time}`;
        } else if (prop === 'time') {
            const date = dateUtils.formatAsDate(dateUtils.toDateTime(this.state.reminder.timestamp));
            changes.timestamp = `${date} ${e}`;
        } else {
            changes[prop] = e;
        }
    }

    render() {
        const date = dateUtils.formatAsDate(dateUtils.toDateTime(this.state.reminder.timestamp));
        const time = dateUtils.formatAsTime(dateUtils.toDateTime(this.state.reminder.timestamp));

        const showValidation =
            this.isCreator || !_.isEqual(this.state.reminder, this.selectEntity(this._ownEntityId()));
        const validMessage = !_.isEmpty(this.state.reminder.message);
        const validDate = dateUtils.toDateTime(this.state.reminder.timestamp).isAfter(dateUtils.dayjs());

        return (
            <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 4 }}>
                <ListItem
                    leftContent={
                        <View style={{ flex: 1 }}>
                            <TextInput
                                multiline
                                label="Message"
                                mode="flat"
                                error={showValidation && !validMessage}
                                style={{ backgroundColor: 'none', paddingHorizontal: 0 }}
                                value={this.state.reminder.message}
                                onChangeText={this.handleChange.bind(this, 'message')}
                            />
                            {showValidation && !validMessage && (
                                <Typography variant="caption" color="error" style={{ marginTop: 6 }}>
                                    Message cannot be empty
                                </Typography>
                            )}
                        </View>
                    }
                    contentStyle={{ paddingTop: 4 }}
                />
                <DueDateControl label="Date" datesOnly value={date} onChange={this.handleChange.bind(this, 'date')} />
                <TimePicker
                    label="Time"
                    value={time}
                    onChange={this.handleChange.bind(this, 'time')}
                    minuteInterval={15}
                />
                {showValidation && this.isCreator && !validDate && (
                    <ListItem
                        leftContent={
                            <Typography variant="caption" color="error" style={{ marginTop: 6 }}>
                                Must be in the future
                            </Typography>
                        }
                        contentStyle={{ minHeight: 0, paddingTop: 0 }}
                    />
                )}
            </View>
        );
    }
}

// TODO: Add validation
ReminderEditor.propTypes = {
    route: PropTypes.object,
    getReminder: PropTypes.func,
    showValidation: PropTypes.bool,
};

const mapStateToProps = state => ({
    getReminder: getRemindersSelectors(state.reminders).selectById,
});

export default connect(mapStateToProps, null)(ReminderEditor);
