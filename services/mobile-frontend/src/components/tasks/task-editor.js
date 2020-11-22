import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, LayoutAnimation } from 'react-native';
import { Text, TextInput, Checkbox, Colors } from 'react-native-paper';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, updateTask, updateTaskLocal } from '@logan/fe-shared/store/tasks';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import priorities from '../shared/priority-constants';
import { colorStyles, typographyStyles } from '../shared/typography';
import DueDatePicker from '../shared/pickers/due-date-picker';
import ListItem from '../shared/list-item';

// A generic task editor, to be used for creation or editing in a ViewController
class TaskEditor extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'task', mobile: true });
        this.toggleDueDatePicker = this.toggleDueDatePicker.bind(this);

        let task;

        if (this.isEditor) {
            task = props.getTask(props.route.params.tid);
        } else {
            task = {
                title: '',
                description: '',
                dueDate: dateUtils.formatAsDate(),
                priority: 0,
            };
        }

        this.state = {
            task,
            dueDatePickerOpen: false,
            dueDatePickerHeight: 0,
        };
    }

    toggleDueDatePicker() {
        if (this.state.dueDatePickerOpen) {
            return this.closeDatePicker();
        } else {
            return this.openDatePicker();
        }
    }

    async openDatePicker(duration = 500) {
        await this.setStateSync({
            dueDatePickerOpen: true,
            dueDatePickerHeight: 0,
        });

        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );

        this.setState({ dueDatePickerHeight: 'auto' });

        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async closeDatePicker(duration = 200) {
        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );

        this.setState({
            dueDatePickerOpen: false,
            dueDatePickerHeight: 0,
        });

        return new Promise(resolve => setTimeout(resolve, duration));
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
            <View style={{ flex: 1 }}>
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
                <ListItem
                    leftContent={<Text style={typographyStyles.body}>Due Date</Text>}
                    rightContent={
                        <Text style={{ ...typographyStyles.body, ...colorStyles.secondary }}>
                            {dateUtils.readableDueDate(this.state.task.dueDate)}
                        </Text>
                    }
                    onPress={this.toggleDueDatePicker}
                />
                <View style={{ overflow: 'hidden', height: this.state.dueDatePickerHeight, backgroundColor: 'white' }}>
                    {this.state.dueDatePickerOpen && (
                        <View
                            style={{
                                height: this.state.dueDatePickerHeight,
                                paddingBottom: 12,
                            }}
                        >
                            <DueDatePicker
                                value={this.state.task.dueDate}
                                onChange={this.handleChange.bind(this, 'dueDate')}
                            />
                        </View>
                    )}
                </View>
                <ListItem
                    showRightArrow
                    leftContent={<Text style={{ ...typographyStyles.body }}>Course</Text>}
                    rightContent={
                        <Text
                            style={{
                                ...typographyStyles.body,
                                color: _.get(course, 'color', Colors.grey500),
                                fontWeight: course ? 'bold' : 'normal',
                            }}
                        >
                            {course ? course.title : 'None'}
                        </Text>
                    }
                    onPress={() =>
                        this.props.navigation.navigate('Course Picker', {
                            cid: _.get(course, 'cid'),
                            onSelect: this.handleChange.bind(this, 'cid'),
                        })
                    }
                />
                <ListItem
                    showRightArrow
                    leftContent={<Text style={typographyStyles.body}>Priority</Text>}
                    rightContent={
                        <Text
                            style={{
                                ...typographyStyles.body,
                                fontWeight: 'bold',
                                color: priority.color,
                            }}
                        >
                            {priority.name}
                        </Text>
                    }
                    onPress={() =>
                        this.props.navigation.navigate('Priority Picker', {
                            value: this.state.task.priority,
                            onSelect: this.handleChange.bind(this, 'priority'),
                        })
                    }
                />
            </View>
        );
    }
}

TaskEditor.propTypes = {
    mode: PropTypes.oneOf(_.values(Editor.Mode)),
    navigation: PropTypes.object,
    route: PropTypes.object,
    getTask: PropTypes.func,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
    updateTaskLocal: PropTypes.func,
    updateTask: PropTypes.func,
};

TaskEditor.defaultProps = {
    mode: Editor.Mode.Edit,
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

export default connect(mapStateToProps, mapDispatchToState)(TaskEditor);
