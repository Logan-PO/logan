import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import Editor from '@logan/fe-shared/components/editor';
import { List, FAB } from 'react-native-paper';
import ViewController from '../shared/view-controller';
import RemindersList from '../reminders/reminders-list';
import AssignmentEditor from './assignment-editor';
import SubtasksList from './subtasks-list';

class AssignmentDetails extends React.Component {
    constructor(props) {
        super(props, { id: 'aid', entity: 'assignment', mobile: true });

        this.onUpdate = this.onUpdate.bind(this);
        this.newSubtask = this.newSubtask.bind(this);
        this.newReminder = this.newReminder.bind(this);

        this.state = {
            assignment: {},
            fabOpen: false,
        };
    }

    newSubtask() {
        this.props.navigation.navigate('New Task', {
            screen: 'New Task',
            params: { aid: this.state.assignment.aid },
        });
    }

    newReminder() {
        this.props.navigation.navigate('New Reminder', {
            eid: this.state.assignment.aid,
            entityType: 'assignment',
        });
    }

    onUpdate(assignment) {
        this.setState({ assignment });
    }

    render() {
        return (
            <React.Fragment>
                <ViewController title="Assignment" navigation={this.props.navigation} route={this.props.route}>
                    <ScrollView keyboardDismissMode="on-drag">
                        <AssignmentEditor
                            route={this.props.route}
                            navigation={this.props.navigation}
                            mode={Editor.Mode.Edit}
                            onChange={this.onUpdate}
                        />
                        <List.Subheader>Subtasks</List.Subheader>
                        <SubtasksList
                            route={this.props.route}
                            navigation={this.props.navigation}
                            aid={this.props.route.params.aid}
                        />
                        <RemindersList
                            eid={this.state.assignment.aid}
                            navigation={this.props.navigation}
                            route={this.props.route}
                        />
                    </ScrollView>
                </ViewController>
                <FAB.Group
                    open={this.state.fabOpen}
                    color="white"
                    icon={this.state.fabOpen ? 'close' : 'plus'}
                    actions={[
                        {
                            icon: 'bell-plus',
                            label: 'Reminder',
                            onPress: this.newReminder,
                        },
                        {
                            icon: 'plus',
                            label: 'Subtask',
                            onPress: this.newSubtask,
                        },
                    ]}
                    onStateChange={({ open }) => this.setState({ fabOpen: open })}
                />
            </React.Fragment>
        );
    }
}

AssignmentDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default AssignmentDetails;
