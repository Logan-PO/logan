import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import Editor from '@logan/fe-shared/components/editor';
import { List, FAB } from 'react-native-paper';
import ViewController from '../shared/view-controller';
import AssignmentEditor from './assignment-editor';
import SubtasksList from './subtasks-list';

class AssignmentDetails extends React.Component {
    constructor(props) {
        super(props, { id: 'aid', entity: 'assignment', mobile: true });
        this.onUpdate = this.onUpdate.bind(this);
        this.newSubtask = this.newSubtask.bind(this);
    }

    newSubtask() {
        this.props.navigation.navigate('New Task', {
            screen: 'New Task',
            params: { aid: this.state.assignment.aid },
        });
    }

    onUpdate(assignment) {
        this.setState({ assignment });
    }

    render() {
        //TODO: Generalize this maybe?
        return (
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
                </ScrollView>
                <View>
                    <FAB
                        icon="plus"
                        color="white"
                        style={{
                            position: 'absolute',
                            margin: 16,
                            bottom: 0,
                            right: 0,
                        }}
                        onPress={this.newSubtask}
                    />
                </View>
            </ViewController>
        );
    }
}

AssignmentDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default AssignmentDetails;
