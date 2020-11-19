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
import ViewController from '../shared/view-controller';
import { colorStyles, typographyStyles } from '../shared/typography';
import DueDatePicker from '../shared/pickers/due-date-picker';

class TaskDetails extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'task', mobile: true });

        this.toggleDueDatePicker = this.toggleDueDatePicker.bind(this);

        this.state = {
            task: props.getTask(props.route.params.tid),
            dueDatePickerOpen: false,
        };
    }

    toggleDueDatePicker() {
        this.setState({ dueDatePickerOpen: !this.state.dueDatePickerOpen });
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
            <ViewController title="Task" navigation={this.props.navigation} route={this.props.route}>
                <ScrollView keyboardDismissMode="on-drag">
                    <View style={{ flexDirection: 'column', padding: 12, paddingBottom: 24, backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Checkbox.Android
                                status={this.state.task.complete ? 'checked' : 'unchecked'}
                                onPress={() => this.handleChange('complete', !this.state.task.complete)}
                                color={course && course.color}
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
                        style={{ backgroundColor: 'white', paddingTop: 12, paddingBottom: 6 }}
                        title={
                            <View
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingRight: 8,
                                }}
                            >
                                <Text style={{ ...typographyStyles.body }}>Due Date</Text>
                                <Text
                                    style={{
                                        ...typographyStyles.body,
                                        ...colorStyles.secondary,
                                    }}
                                >
                                    {dateUtils.readableDueDate(this.state.task.dueDate)}
                                </Text>
                            </View>
                        }
                        onPress={this.toggleDueDatePicker}
                    />
                    {this.state.dueDatePickerOpen && (
                        <View style={{ backgroundColor: 'white', paddingBottom: 12 }}>
                            <DueDatePicker
                                value={this.state.task.dueDate}
                                onChange={this.handleChange.bind(this, 'dueDate')}
                            />
                        </View>
                    )}
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
                                <Text style={{ ...typographyStyles.body }}>Course</Text>
                                <Text
                                    style={{
                                        ...typographyStyles.body,
                                        color: _.get(course, 'color', Colors.grey500),
                                        fontWeight: course ? 'bold' : 'normal',
                                    }}
                                >
                                    {course ? course.title : 'None'}
                                </Text>
                            </View>
                        }
                        right={() => (
                            <Icon name="chevron-right" size={24} style={{ color: 'gray', alignSelf: 'center' }} />
                        )}
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
                                <Text style={{ ...typographyStyles.body }}>Priority</Text>
                                <Text
                                    style={{
                                        ...typographyStyles.body,
                                        fontWeight: 'bold',
                                        color: priority.color,
                                    }}
                                >
                                    {priority.name}
                                </Text>
                            </View>
                        }
                        right={() => (
                            <Icon name="chevron-right" size={24} style={{ color: 'gray', alignSelf: 'center' }} />
                        )}
                        onPress={() =>
                            this.props.navigation.navigate('Priority Picker', {
                                value: this.state.task.priority,
                                onSelect: this.handleChange.bind(this, 'priority'),
                            })
                        }
                    />
                </ScrollView>
            </ViewController>
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
