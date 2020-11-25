import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import Editor from '@logan/fe-shared/components/editor';
import ViewController from '../shared/view-controller';
import TaskEditor from './task-editor';

class TaskDetails extends React.Component {
    constructor(props) {
        super(props, { id: 'tid', entity: 'task', mobile: true });
        this.onUpdate = this.onUpdate.bind(this);
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
                </ScrollView>
            </ViewController>
        );
    }
}

TaskDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default TaskDetails;
