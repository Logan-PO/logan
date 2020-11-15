import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { Text, TextInput, Checkbox, List, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, updateTask, updateTaskLocal } from '@logan/fe-shared/store/tasks';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import priorities from '../shared/priority-constants';

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

        if (changes.complete) changes.completionDate = dateUtils.formatAsDateTime();
    }

    render() {
        const relatedAssignment = this.props.getAssignment(_.get(this.state.task, 'aid'));
        const cid = relatedAssignment ? relatedAssignment.cid : _.get(this.state.task, 'cid');
        const course = this.props.getCourse(cid);

        const priorityEntry = _.find(
            _.entries(priorities),
            // eslint-disable-next-line no-unused-vars
            ([name, [value, color]]) => value === this.state.task.priority
        );

        const priority = {
            name: priorityEntry[0],
            color: priorityEntry[1][1],
        };

        return (
            <ScrollView>
                <View style={{ flexDirection: 'column', padding: 12, paddingBottom: 24, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Checkbox.Android
                            status={this.state.task.complete ? 'checked' : 'unchecked'}
                            onPress={() => this.handleChange('complete', !this.state.task.complete)}
                        />
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
                    title={
                        <View
                            style={{
                                height: '100%',
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingRight: 4,
                            }}
                        >
                            <Text style={{ fontSize: 16, lineHeight: 16 }}>Course</Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 16,
                                    color: _.get(course, 'color', Colors.grey500),
                                    fontWeight: course ? 'bold' : 'normal',
                                }}
                            >
                                {course ? course.title : 'None'}
                            </Text>
                        </View>
                    }
                    right={() => <Icon name="chevron-right" size={24} style={{ color: 'gray', alignSelf: 'center' }} />}
                    onPress={() =>
                        this.props.navigation.navigate('Course Picker', {
                            cid: _.get(course, 'cid'),
                            onSelect: this.handleChange.bind(this, 'cid'),
                        })
                    }
                />
                <List.Item
                    style={{ backgroundColor: 'white' }}
                    title={
                        <View
                            style={{
                                height: '100%',
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingRight: 4,
                            }}
                        >
                            <Text style={{ fontSize: 16, lineHeight: 16 }}>Priority</Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 16,
                                    color: priority.color,
                                }}
                            >
                                {priority.name}
                            </Text>
                        </View>
                    }
                    right={() => <Icon name="chevron-right" size={24} style={{ color: 'gray', alignSelf: 'center' }} />}
                    onPress={() =>
                        this.props.navigation.navigate('Priority Picker', {
                            value: this.state.task.priority,
                            onSelect: this.handleChange.bind(this, 'priority'),
                        })
                    }
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
