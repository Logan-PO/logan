import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text, TextInput, Colors } from 'react-native-paper';
import { dateUtils } from '@logan/core';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import Typography, { typographyStyles } from '../shared/typography';
import ListItem from '../shared/list-item';
import DueDateControl from '../shared/due-date-control';
import SubtasksList from './subtasks-list';

// A generic assignment editor, to be used for creation or editing in a ViewController
class AssignmentEditor extends Editor {
    constructor(props) {
        super(props, { id: 'aid', entity: 'assignment', mobile: true });

        let assignment;

        if (this.isEditor) {
            assignment = props.getAssignment(props.route.params.aid);
        } else {
            assignment = {
                //TODO: Fix this to be empty assignment
                title: '',
                description: '',
                dueDate: dateUtils.formatAsDate(),
            };
        }

        this.state = { assignment };
    }

    selectEntity(id) {
        return this.props.getAssignment(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateAssignmentLocal({ id, changes });
    }

    updateEntity(assignment) {
        this.props.updateAssignment(assignment);
    }

    processChange(changes, prop, e) {
        changes[prop] = e;

        if (changes.complete) changes.completionDate = dateUtils.formatAsDateTime();
    }

    render() {
        const cid = _.get(this.state.assignment, 'cid');
        const course = this.props.getCourse(cid);
        return (
            <View style={{ flex: 1 }}>
                <ListItem
                    leftContent={
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                            <TextInput
                                style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                                mode="flat"
                                label="Title"
                                value={this.state.assignment.title}
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
                                value={this.state.assignment.description}
                                onChangeText={this.handleChange.bind(this, 'description')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 4 }}
                />
                <DueDateControl
                    datesOnly={true}
                    value={this.state.assignment.dueDate}
                    onChange={this.handleChange.bind(this, 'dueDate')}
                />
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
                <SubtasksList aid={_.get(this.state.assignment, 'aid')} />
            </View>
        );
    }
}

AssignmentEditor.propTypes = {
    mode: PropTypes.oneOf(_.values(Editor.Mode)),
    navigation: PropTypes.object,
    route: PropTypes.object,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
    updateAssignmentLocal: PropTypes.func,
    updateAssignment: PropTypes.func,
};

AssignmentEditor.defaultProps = {
    mode: Editor.Mode.Edit,
};

const mapStateToProps = state => ({
    getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    getCourse: getCourseSelectors(state.schedule).selectById,
});

const mapDispatchToState = {
    updateAssignment,
    updateAssignmentLocal,
};

export default connect(mapStateToProps, mapDispatchToState)(AssignmentEditor);
