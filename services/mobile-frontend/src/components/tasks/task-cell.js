import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Checkbox, Colors } from 'react-native-paper';
import { getTasksSelectors, updateTask, updateTaskLocal } from '@logan/fe-shared/store/tasks';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import { dateUtils } from '@logan/core';
import PriorityDisplay from '../shared/displays/priority-display';
import Typography from '../shared/typography';
import ListItem from '../shared/list-item';
import TagsDisplay from '../shared/tags/tags-display';

class TaskCell extends React.Component {
    constructor(props) {
        super(props);

        this.check = this.check.bind(this);
        this.listItem = React.createRef();

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

    check() {
        this.handleChange('complete', !this.state.task.complete);
    }

    async moveToToday() {
        await this.listItem.current.close();
        await this.handleChange('dueDate', dateUtils.formatAsDate(dateUtils.dayjs()));
        this.listItem.current.resetHeight();
    }

    async handleChange(prop, newValue) {
        const changes = {};

        changes[prop] = newValue;

        if (changes.complete) {
            changes.completionDate = dateUtils.formatAsDateTime();
        }

        const afterUpdates = _.merge({}, this.state.task, changes);

        this.setState({
            task: afterUpdates,
        });

        await this.listItem.current.collapse();

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
            this.props.onDeletePressed(this.state.task, {
                confirm: this.listItem.current.collapse,
                deny: this.listItem.current.close,
            });
        }
    }

    render() {
        if (!this.state.task) return <ListItem />;

        const checkboxStatus = this.state.task.complete ? 'checked' : 'unchecked';
        const relatedAssignment = this.props.getAssignment(this.state.task.aid);
        const course = this.props.getCourse(relatedAssignment ? relatedAssignment.cid : this.state.task.cid);
        const marginSize = 70;
        return (
            <ListItem
                ref={this.listItem}
                beforeContent={<PriorityDisplay priority={this.state.task.priority} />}
                contentStyle={{ paddingLeft: 12 }}
                leftContent={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox.Android status={checkboxStatus} onPress={this.check} color={course && course.color} />
                        <View style={{ flexDirection: 'column', marginLeft: 8 }}>
                            <View style={{ marginRight: marginSize }}>
                                <Typography variant="body">{this.state.task.title}</Typography>
                            </View>
                            {this.shouldShowOverdueLabel() && (
                                <View style={{ marginTop: 2 }}>
                                    <Typography variant="body2" color="error">
                                        {this.overdueLabelContent()}
                                    </Typography>
                                </View>
                            )}
                            {!_.isEmpty(this.state.task.tags) && (
                                <TagsDisplay style={{ marginTop: 4 }} tags={this.state.task.tags} />
                            )}
                            {!_.isEmpty(this.state.task.description) && (
                                <View style={{ marginTop: 2, marginRight: marginSize }}>
                                    <Typography variant="body2" color="secondary">
                                        {this.state.task.description}
                                    </Typography>
                                </View>
                            )}
                        </View>
                    </View>
                }
                onPress={this.props.onPress}
                actions={this.props.subTask ? undefined : this.actionsToShow()}
            />
        );
    }
}

TaskCell.propTypes = {
    subTask: PropTypes.bool,
    tid: PropTypes.string,
    getTask: PropTypes.func,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
    updateTask: PropTypes.func,
    updateTaskLocal: PropTypes.func,
    showOverdueLabel: PropTypes.bool,
    onPress: PropTypes.func,
    onDeletePressed: PropTypes.func,
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
