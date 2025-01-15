import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { FAB } from 'react-native-paper';
import Editor from 'packages/fe-shared/components/editor';
import ViewController from '../shared/view-controller';
import RemindersList from '../reminders/reminders-list';
import TaskEditor from './task-editor';

class TaskDetails extends React.Component {
    constructor(props) {
        super(props, { id: 'tid', entity: 'task', mobile: true });
        this.onUpdate = this.onUpdate.bind(this);
        this.state = {
            task: {},
        };
    }

    onUpdate(task) {
        this.setState({ task });
    }

    render() {
        return (
            <ViewController title="Task" navigation={this.props.navigation} route={this.props.route}>
                <ScrollView keyboardDismissMode="on-drag">
                    <TaskEditor
                        route={this.props.route}
                        navigation={this.props.navigation}
                        mode={Editor.Mode.Edit}
                        onChange={this.onUpdate}
                    />
                    <RemindersList
                        eid={this.state.task.tid}
                        navigation={this.props.navigation}
                        route={this.props.route}
                    />
                </ScrollView>
                <FAB
                    icon="bell-plus"
                    color="white"
                    style={{
                        position: 'absolute',
                        margin: 16,
                        bottom: 0,
                        right: 0,
                    }}
                    onPress={() =>
                        this.props.navigation.navigate('New Reminder', { eid: this.state.task.tid, entityType: 'task' })
                    }
                />
            </ViewController>
        );
    }
}

TaskDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default TaskDetails;
