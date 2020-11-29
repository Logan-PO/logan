import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import Editor from '@logan/fe-shared/components/editor';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updateReminderLocal, updateReminder } from '@logan/fe-shared/store/reminders';
import ViewController from '../shared/view-controller';
import ReminderEditor from './reminder-editor';

class ReminderDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    close() {
        this.props.navigation.goBack();
    }

    async save() {
        await this.props.updateReminder(this.state.reminder);
        this.close();
    }

    onUpdate(reminder) {
        this.setState({ reminder });
    }

    render() {
        const leftActions = <Appbar.Action icon="close" onPress={this.close} />;
        const rightActions = (
            <Appbar.Action
                icon={props => <Icon {...props} name="done" color="white" size={24} />}
                onPress={this.create}
            />
        );

        return (
            <ViewController
                title="Edit Reminder"
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
                        mode={Editor.Mode.Edit}
                        onChange={this.onUpdate}
                    />
                </ScrollView>
            </ViewController>
        );
    }
}

ReminderDisplay.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    updateReminder: PropTypes.func,
    updateReminderLocal: PropTypes.func,
};

const mapDispatchToLocal = {
    updateReminder,
    updateReminderLocal,
};

export default connect(null, mapDispatchToLocal)(ReminderDisplay);
