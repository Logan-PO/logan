import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewController from '../shared/view-controller';
import ReminderEditor from './reminder-editor';
import { createReminder } from 'packages/fe-shared/store/reminders';
import Editor from 'packages/fe-shared/components/editor';
import { dateUtils } from 'packages/core';

class NewReminderModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        this.state = {
            valid: false,
            reminder: {},
        };
    }

    close() {
        this.props.navigation.goBack();
    }

    async create() {
        await this.props.createReminder(this.state.reminder);
        this.close();
    }

    onUpdate(reminder) {
        const messageValid = !_.isEmpty(reminder.message);
        const tsValid = dateUtils.toDateTime(reminder.timestamp).isAfter(dateUtils.dayjs());

        this.setState({
            valid: messageValid && tsValid,
            reminder,
        });
    }

    render() {
        const leftActions = <Appbar.Action icon="close" onPress={this.close} />;
        const rightActions = (
            <Appbar.Action
                disabled={!this.state.valid}
                icon={props => <Icon {...props} name="done" color="white" size={24} />}
                onPress={this.create}
            />
        );

        return (
            <ViewController
                title="New Reminder"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActions={leftActions}
                rightActions={rightActions}
            >
                <ScrollView keyboardDismissMode="on-drag">
                    <ReminderEditor
                        route={this.props.route}
                        navigation={this.props.navigation}
                        mode={Editor.Mode.Create}
                        onChange={this.onUpdate}
                    />
                </ScrollView>
            </ViewController>
        );
    }
}

NewReminderModal.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    createReminder: PropTypes.func,
};

const mapDispatchToLocal = {
    createReminder,
};

export default connect(null, mapDispatchToLocal)(NewReminderModal);
