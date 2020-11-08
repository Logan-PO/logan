import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAssignmentsSelectors } from '../../store/assignments';
import { getScheduleSelectors, getSectionSelectors } from '../../store/schedule';
import { getTasksSelectors, updateTask, updateTaskLocal } from '../../store/tasks';
import AssignmentCell from '../assignments/assignment-cell';
import TaskCell from '../tasks/task-cell';
import OverviewSectionCell from './overview-section-cell';
import OverviewAssignmentCell from './overview-assignment-cell';
import OverviewTaskCell from './overview-task-cell';

export class OverviewCell extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.selectAssignmentFromStore(this.props.eid)) this.type = 'assignment';
        else if (this.props.selectTaskFromStore(this.props.eid)) this.type = 'task';
        else this.type = 'section';
        this.determinePrimaryFormatting = this.determinePrimaryFormatting.bind(this);
        this.determineSecondaryFormatting = this.determineSecondaryFormatting.bind(this);

        this.state = {
            event: this.determineEventData(this.type),
        };
    }
    determineEventData(type) {
        switch (type) {
            case 'assignment':
                return this.props.selectAssignmentFromStore(this.props.eid);
            case 'task':
                return this.props.selectTaskFromStore(this.props.eid);
            case 'section':
                return this.props.selectSectionFromStore(this.props.eid);
            default:
                return undefined;
        }
    }

    determinePrimaryFormatting(type) {
        switch (type) {
            case 'assignment':
                return this.props.condensed ? (
                    <OverviewAssignmentCell key={this.props.eid} aid={this.props.eid} />
                ) : (
                    <AssignmentCell key={this.props.eid} aid={this.props.eid} />
                );
            case 'task':
                return this.props.condensed ? (
                    <OverviewTaskCell key={this.props.eid} tid={this.props.eid} />
                ) : (
                    <TaskCell key={this.props.eid} tid={this.props.eid} />
                );
            case 'section':
                return (
                    <OverviewSectionCell condensed={this.props.condensed} key={this.props.eid} sid={this.props.eid} />
                );
            default:
                return undefined;
        }
    }

    determineSecondaryFormatting(type) {
        return type === 'section' ? _.get(this.state, 'event.location') : _.get(this.state, 'event.description');
    }

    render() {
        return this.determinePrimaryFormatting(this.type);
    }
}
OverviewCell.propTypes = {
    condensed: PropTypes.boolean,
    eid: PropTypes.string,
    selectAssignmentFromStore: PropTypes.func,
    selectTaskFromStore: PropTypes.func,
    selectSectionFromStore: PropTypes.func,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectSectionFromStore: getSectionSelectors(state.schedule).selectById,
        selectTaskFromStore: getTasksSelectors(state.tasks).selectById,
        selectAssignmentFromStore: getAssignmentsSelectors(state.assignments).selectById,
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
        getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCell);
