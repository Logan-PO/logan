import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text, TextInput, Checkbox, Colors } from 'react-native-paper';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, updateTask, updateTaskLocal } from '@logan/fe-shared/store/tasks';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import priorities from '../shared/priority-constants';
import Typography, { typographyStyles } from '../shared/typography';
import ListItem from '../shared/list-item';
import DueDateControl from '../shared/due-date-control';

// A generic task editor, to be used for creation or editing in a ViewController
class TaskEditor extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'task', mobile: true });

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

        this.state = { task };
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
                <ListItem
                    leftContent={
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                            <View style={{ flex: 0, paddingBottom: 2, paddingRight: 6 }}>
                                <Checkbox.Android
                                    status={this.state.task.complete ? 'checked' : 'unchecked'}
                                    onPress={() => this.handleChange('complete', !this.state.task.complete)}
                                    color={course && course.color}
                                />
                            </View>
                            <TextInput
                                style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                                mode="flat"
                                label="Title"
                                value={this.state.task.title}
                                onChangeText={this.handleChange.bind(this, 'title')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingVertical: 4, paddingLeft: 4 }}
                />
                <ListItem
                    leftContent={
                        <View style={{ flex: 1 }}>
                            <TextInput
                                multiline
                                label="Description"
                                mode="flat"
                                style={{ backgroundColor: 'none', paddingHorizontal: 0 }}
                                value={this.state.task.description}
                                onChangeText={this.handleChange.bind(this, 'description')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 4 }}
                />
                <DueDateControl value={this.state.task.dueDate} onChange={this.handleChange.bind(this, 'dueDate')} />
                <ListItem
                    showRightArrow
                    leftContent={<Typography>Course</Typography>}
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
                    leftContent={<Typography>Priority</Typography>}
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
