import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import { getTasksSelectors, updateTask, updateTaskLocal } from '@logan/fe-shared/store/tasks';
import Editor from '@logan/fe-shared/components/editor';

class TaskDetails extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'task', mobile: true });

        this.state = {
            task: props.getTask(props.route.params.tid),
        };
    }

    selectEntity(id) {
        return this.props.getTask(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateTaskLocal({ id, changes });
    }

    updateEntity(task) {
        this.props.updateTask(task);
    }

    processChange(changes, prop, e) {
        changes[prop] = e;
    }

    render() {
        console.log(this.state);

        return (
            <ScrollView>
                <View style={{ flexDirection: 'column', padding: 12, paddingBottom: 24, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Checkbox.Android />
                        <TextInput
                            style={{ flexGrow: 1, backgroundColor: 'none' }}
                            mode="flat"
                            label="Title"
                            value={this.state.task.title}
                            onChangeText={this.handleChange.bind(this, 'title')}
                        />
                    </View>
                    <View>
                        <TextInput
                            multiline
                            label="Description"
                            mode="flat"
                            style={{ backgroundColor: 'none' }}
                            value={this.state.task.description}
                            onChangeText={this.handleChange.bind(this, 'description')}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

TaskDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    getTask: PropTypes.func,
    updateTaskLocal: PropTypes.func,
    updateTask: PropTypes.func,
};

const mapStateToProps = state => ({
    getTask: getTasksSelectors(state.tasks).selectById,
});

const mapDispatchToState = {
    updateTask,
    updateTaskLocal,
};

export default connect(mapStateToProps, mapDispatchToState)(TaskDetails);
