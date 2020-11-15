import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text, List, Checkbox } from 'react-native-paper';
import { getTasksSelectors, updateTask, updateTaskLocal } from '@logan/fe-shared/store/tasks';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import { dateUtils } from '@logan/core';
import PriorityDisplay from '../shared/displays/priority-display';
import CourseLabel from '../shared/displays/course-label';
import { typographyStyles, colorStyles } from '../shared/typography';

class TaskCell extends React.Component {
    constructor(props) {
        super(props);

        this.check = this.check.bind(this);
        this.selected = this.selected.bind(this);

        this.state = {
            task: props.getTask(props.tid),
        };
    }

    componentDidUpdate() {
        const storeTask = this.props.getTask(this.props.tid);

        if (!_.isEqual(storeTask, this.state.task)) {
            this.setState({ task: storeTask });
        }
    }

    selected() {
        this.props.onPress && this.props.onPress(this.props.tid);
    }

    check() {
        this.handleChange('complete', !this.state.task.complete);
    }

    handleChange(prop, newValue) {
        const changes = {};

        changes[prop] = newValue;

        if (changes.complete) {
            changes.completionDate = dateUtils.formatAsDateTime();
        }

        const afterUpdates = _.merge({}, this.state.task, changes);

        this.setState({
            task: afterUpdates,
        });

        this.props.updateTaskLocal({
            id: this.props.tid,
            changes,
        });

        this.props.updateTask(afterUpdates);
    }

    shouldShowOverdueLabel() {
        if (!this.props.showOverdueLabel) return false;
        if (!dateUtils.dueDateIsDate(this.state.task.dueDate)) return false;

        const dateValue = dateUtils.toDate(this.state.task.dueDate);
        return dateValue.isBefore(dateUtils.dayjs(), 'day');
    }

    overdueLabelContent() {
        const dateValue = dateUtils.toDate(this.state.task.dueDate);
        const days = dateUtils.dayjs().diff(dateValue, 'day');

        if (days === 1) {
            return 'Due yesterday';
        } else {
            return `Due ${days} days ago`;
        }
    }

    renderContent() {
        const checkboxStatus = this.state.task.complete ? 'checked' : 'unchecked';
        const relatedAssignment = this.props.getAssignment(this.state.task.aid);
        const course = this.props.getCourse(relatedAssignment ? relatedAssignment.cid : this.state.task.cid);

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox.Android status={checkboxStatus} onPress={this.check} />
                <View style={{ flexDirection: 'column', marginLeft: 8 }}>
                    {(course || relatedAssignment) && (
                        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                            {course && <CourseLabel cid={course.cid} />}
                            {relatedAssignment && (
                                <Text style={{ ...typographyStyles.body2, ...colorStyles.secondary }}>
                                    {course && relatedAssignment && ' / '}
                                    {relatedAssignment.title}
                                </Text>
                            )}
                        </View>
                    )}
                    <View>
                        <Text style={{ ...typographyStyles.body }}>{this.state.task.title}</Text>
                    </View>
                    {this.shouldShowOverdueLabel() && (
                        <View style={{ marginTop: 2 }}>
                            <Text style={{ ...typographyStyles.body2, ...colorStyles.red }} allowFontScaling>
                                {this.overdueLabelContent()}
                            </Text>
                        </View>
                    )}
                    <View>
                        <Text style={{ ...typographyStyles.body2, ...colorStyles.secondary }}>
                            {this.state.task.description}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        if (!this.state.task) return <List.Item />;

        return (
            <View style={{ flexDirection: 'row' }}>
                <PriorityDisplay priority={this.state.task.priority} />
                <View style={{ flexGrow: 1 }}>
                    <List.Item
                        style={{ backgroundColor: 'white', paddingHorizontal: 0 }}
                        onPress={this.selected}
                        title={this.renderContent()}
                    />
                </View>
            </View>
        );
    }
}

TaskCell.propTypes = {
    tid: PropTypes.string,
    getTask: PropTypes.func,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
    updateTask: PropTypes.func,
    updateTaskLocal: PropTypes.func,
    showOverdueLabel: PropTypes.bool,
    onPress: PropTypes.func,
};

const mapStateToProps = state => ({
    getTask: getTasksSelectors(state.tasks).selectById,
    getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    getCourse: getCourseSelectors(state.schedule).selectById,
});

const mapDispatchToProps = {
    updateTask,
    updateTaskLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskCell);
