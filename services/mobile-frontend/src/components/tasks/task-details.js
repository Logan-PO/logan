import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { TextInput, Checkbox, List } from 'react-native-paper';
import { getTasksSelectors, updateTask, updateTaskLocal } from '@logan/fe-shared/store/tasks';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import _ from 'lodash';

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
        const relatedAssignment = this.props.getAssignment(_.get(this.state.task, 'aid'));
        const cid = relatedAssignment ? relatedAssignment.cid : _.get(this.state.task, 'cid');
        const course = this.props.getCourse(cid);

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
                <List.Item
                    style={{ backgroundColor: 'white' }}
                    title={course ? course.title : 'None'}
                    titleStyle={{ color: _.get(course, 'color', 'black'), fontWeight: course ? 'bold' : 'normal' }}
                    onPress={() => this.props.navigation.navigate('Course Picker')}
                />
            </ScrollView>
        );
    }
}

TaskDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    getTask: PropTypes.func,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
    updateTaskLocal: PropTypes.func,
    updateTask: PropTypes.func,
};

const mapStateToProps = state => ({
    getTask: getTasksSelectors(state.tasks).selectById,
    getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    getCourse: getCourseSelectors(state.schedule).selectById,
});

const mapDispatchToState = {
    updateTask,
    updateTaskLocal,
};

export default connect(mapStateToProps, mapDispatchToState)(TaskDetails);
