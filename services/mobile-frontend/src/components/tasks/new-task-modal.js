import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewController from '../shared/view-controller';
import TaskEditor from './task-editor';
import { createTask } from 'packages/fe-shared/store/tasks';
import Editor from 'packages/fe-shared/components/editor';

class NewTaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);

        this.state = {
            task: {},
        };
    }

    close() {
        this.props.navigation.goBack();
    }

    async create() {
        await this.props.createTask(this.state.task);
        this.close();
    }

    update(task) {
        this.setState({ task });
    }

    render() {
        const aid = _.get(this.props, 'route.params.aid');
        const leftActions = <Appbar.Action icon="close" onPress={this.close} />;
        const rightActions = (
            <Appbar.Action
                disabled={_.isEmpty(this.state.task.title)}
                icon={props => <Icon {...props} name="done" color="white" size={24} />}
                onPress={this.create}
            />
        );

        return (
            <ViewController
                title={_.get(this.state, 'task.aid') ? 'New Subtask' : 'New Task'}
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActions={leftActions}
                rightActions={rightActions}
            >
                <ScrollView keyboardDismissMode="on-drag">
                    <TaskEditor
                        aid={aid}
                        navigation={this.props.navigation}
                        route={this.props.route}
                        mode={Editor.Mode.Create}
                        onChange={this.update}
                    />
                </ScrollView>
            </ViewController>
        );
    }
}

NewTaskModal.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    createTask: PropTypes.func,
};

const mapDispatchToState = {
    createTask,
};

export default connect(null, mapDispatchToState)(NewTaskModal);
