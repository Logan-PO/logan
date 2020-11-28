import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Colors } from 'react-native-paper';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import { dateUtils } from '@logan/core';
import CourseLabel from '../shared/displays/course-label';
import Typography from '../shared/typography';
import ListItem from '../shared/list-item';

class AssignmentCell extends React.Component {
    constructor(props) {
        super(props);

        this.listItem = React.createRef();

        this.state = {
            assignment: props.getAssignment(props.aid),
        };
    }

    componentDidUpdate() {
        const storeAssignment = this.props.getAssignment(this.props.aid);

        if (!_.isEqual(storeAssignment, this.state.assignment)) {
            this.setState({ assignment: storeAssignment });
        }
    }

    moveToToday() {
        this.handleChange('dueDate', dateUtils.formatAsDate(dateUtils.dayjs()));
    }

    async handleChange(prop, newValue) {
        const changes = {};

        changes[prop] = newValue;

        if (changes.complete) {
            changes.completionDate = dateUtils.formatAsDateTime();
        }

        const afterUpdates = _.merge({}, this.state.assignment, changes);

        this.setState({
            assignment: afterUpdates,
        });

        await this.listItem.current.collapse();

        this.props.updateAssignmentLocal({
            id: this.props.aid,
            changes,
        });

        this.props.updateAssignment(afterUpdates);
    }

    shouldShowOverdueLabel() {
        if (!this.props.showOverdueLabel) return false;
        if (!dateUtils.dueDateIsDate(this.state.assignment.dueDate)) return false;

        const dateValue = dateUtils.toDate(this.state.assignment.dueDate);
        return dateValue.isBefore(dateUtils.dayjs(), 'day');
    }

    overdueLabelContent() {
        const dateValue = dateUtils.toDate(this.state.assignment.dueDate);
        const days = dateUtils.dayjs().diff(dateValue, 'day');

        if (days === 1) {
            return 'Due yesterday';
        } else {
            return `Due ${days} days ago`;
        }
    }

    actionsToShow() {
        const moveToTodayAction = {
            icon: 'arrow-downward',
            backgroundColor: Colors.blue500,
            action: this.moveToToday.bind(this),
        };

        const deleteAction = {
            icon: 'delete',
            backgroundColor: 'red',
            action: this.deletePressed.bind(this),
        };

        const actions = [];

        if (this.shouldShowOverdueLabel()) actions.push(moveToTodayAction);
        actions.push(deleteAction);

        return actions;
    }

    async deletePressed() {
        if (this.props.onDeletePressed) {
            this.props.onDeletePressed(this.state.assignment, {
                confirm: this.listItem.current.collapse,
                deny: this.listItem.current.close,
            });
        }
    }

    render() {
        if (!this.state.assignment) return <ListItem />;
        const cid = _.get(this.state.assignment, 'cid');
        const course = this.props.getCourse(cid);

        const relatedAssignment = this.props.getAssignment(this.state.assignment.aid);

        return (
            <ListItem
                ref={this.listItem}
                leftContent={
                    <View style={{ flex: 1 }}>
                        {(course || relatedAssignment) && (
                            <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                                {course && <CourseLabel cid={course.cid} />}
                                {relatedAssignment && (
                                    <Typography variant="body2" color="secondary">
                                        {course && relatedAssignment && ' / '}
                                        {relatedAssignment.title}
                                    </Typography>
                                )}
                            </View>
                        )}
                        <View>
                            <Typography variant="body">{this.state.assignment.title}</Typography>
                        </View>
                        {this.shouldShowOverdueLabel() && (
                            <View style={{ marginTop: 2 }}>
                                <Typography variant="body2" color="error">
                                    {this.overdueLabelContent()}
                                </Typography>
                            </View>
                        )}
                        {!_.isEmpty(this.state.assignment.description) && (
                            <View style={{ marginTop: 2 }}>
                                <Typography variant="body2" color="secondary">
                                    {this.state.assignment.description}
                                </Typography>
                            </View>
                        )}
                    </View>
                }
                onPress={this.props.onPress}
                actions={this.actionsToShow()}
            />
        );
    }
}

AssignmentCell.propTypes = {
    aid: PropTypes.string,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
    updateAssignment: PropTypes.func,
    updateAssignmentLocal: PropTypes.func,
    showOverdueLabel: PropTypes.bool,
    onPress: PropTypes.func,
    onDeletePressed: PropTypes.func,
};

const mapStateToProps = state => ({
    getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    getCourse: getCourseSelectors(state.schedule).selectById,
});

const mapDispatchToProps = {
    updateAssignment,
    updateAssignmentLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCell);
