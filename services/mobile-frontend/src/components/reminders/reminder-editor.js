import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from '@logan/core';
import { getRemindersSelectors } from '@logan/fe-shared/store/reminders';
import Editor from '@logan/fe-shared/components/editor';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import ListItem from '../shared/list-item';
import DueDateControl from '../shared/due-date-control';
import TimePicker from '../shared/pickers/time-picker';

class ReminderEditor extends Editor {
    constructor(props) {
        super({ ...props, mode: Editor.Mode.Create }, { id: 'rid', entity: 'reminder', mobile: true });

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
            reminder = props.getRandomPassword(props.route.params.rid);
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
            const time = dateUtils.formatAsTime(dateUtils.toTime(this.state.reminder.timestamp));
            changes.timestamp = `${e} ${time}`;
        } else if (prop === 'time') {
            const date = dateUtils.formatAsDate(dateUtils.toTime(this.state.reminder.timestamp));
            changes.timestamp = `${date} ${e}`;
        } else {
            changes[prop] = e;
        }
    }

    render() {
        const date = dateUtils.formatAsDate(dateUtils.toDateTime(this.state.reminder.timestamp));
        const time = dateUtils.formatAsTime(dateUtils.toDateTime(this.state.reminder.timestamp));

        return (
            <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 4 }}>
                <ListItem
                    leftContent={
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    paddingHorizontal: 0,
                                    flexGrow: 1,
                                    backgroundColor: 'none',
                                }}
                                mode="flat"
                                label="Title"
                                value={this.state.reminder.title}
                                onChangeText={this.handleChange.bind(this, 'title')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingVertical: 0 }}
                />
                <ListItem
                    leftContent={
                        <View style={{ flex: 1 }}>
                            <TextInput
                                multiline
                                label="Message"
                                mode="flat"
                                style={{ backgroundColor: 'none', paddingHorizontal: 0 }}
                                value={this.state.reminder.message}
                                onChangeText={this.handleChange.bind(this, 'message')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 4 }}
                />
                <DueDateControl label="Date" datesOnly value={date} onChange={this.handleChange.bind(this, 'date')} />
                <TimePicker label="Time" value={time} onChange={this.handleChange.bind(this, 'time')} />
            </View>
        );
    }
}

// TODO: Add validation
ReminderEditor.propTypes = {
    route: PropTypes.object,
    getReminder: PropTypes.func,
};

const mapStateToProps = state => ({
    getReminder: getRemindersSelectors(state.reminders).selectById,
});

export default connect(mapStateToProps, null)(ReminderEditor);
