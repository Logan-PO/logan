import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from '@material-ui/core';
import { getAssignmentsSelectors } from '../../store/assignments';
import { getScheduleSelectors, getSectionSelectors } from '../../store/schedule';
import { getTasksSelectors, updateTask, updateTaskLocal } from '../../store/tasks';
import AssignmentCell from '../assignments/assignment-cell';
import TaskCell from '../tasks/task-cell';
import OverviewSectionCell from './overview-section-cell';

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
                return <AssignmentCell key={this.props.eid} aid={this.props.eid} />;
            case 'task':
                return <TaskCell key={this.props.eid} tid={this.props.eid} />;
            case 'section':
                return <OverviewSectionCell key={this.props.eid} sid={this.props.eid} />;
            default:
                return undefined;
        }
    }

    determineSecondaryFormatting(type) {
        return type === 'section' ? _.get(this.state, 'event.location') : _.get(this.state, 'event.description');
    }
    render() {
        return (
            <div className="list-cell">
                <ListItem>
                    <ListItemText primary={this.determinePrimaryFormatting(this.type)} />
                </ListItem>
            </div>
        );
    }
}
OverviewCell.propTypes = {
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
    }; //scheduleSelectors.baseSelectors.sections.selectAll()
};

const mapDispatchToProps = { updateTask, updateTaskLocal };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCell);
