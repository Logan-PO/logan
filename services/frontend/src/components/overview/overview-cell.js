import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '../../store/assignments';
import { getScheduleSelectors } from '../../store/schedule';
import { CourseLabel } from '../shared';
import globalStyles from '../../globals/global.scss';
import { getTasksSelectors, updateTask, updateTaskLocal } from '../../store/tasks';

export class OverviewCell extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.selectAssignmentFromStore(this.props.eid)) this.type = 'assignment';
        else if (this.props.selectTaskFromStore(this.props.eid)) this.type = 'task';
        else this.type = 'section';
        this.determinePrimaryFormatting = this.determinePrimaryFormatting.bind(this);
        this.determineSecondaryFormatting = this.determineSecondaryFormatting.bind(this);

        this.state = {
            event:
                this.type === 'assignment'
                    ? this.props.selectAssignmentFromStore(this.props.eid)
                    : this.props.selectTaskFromStore(this.props.eid),
        };
    }

    determinePrimaryFormatting(type) {
        const assignment = _.defaultTo(this.props.getAssignment(_.get(this.state.event, 'aid')), undefined);
        const course = assignment
            ? this.props.getCourse(assignment.cid)
            : this.props.getCourse(_.get(this.state.event, 'cid'));

        const needsUpperLabel = course || assignment;
        const hasBoth = course && assignment;
        switch (type) {
            case 'assignment':
                return (
                    <React.Fragment>
                        {course && (
                            <div className={globalStyles.cellUpperLabel}>
                                <CourseLabel cid={course.cid} />
                            </div>
                        )}
                        <div>{_.get(this.state, 'event.title')}</div>
                    </React.Fragment>
                );
            case 'task':
                return (
                    <React.Fragment>
                        {needsUpperLabel && (
                            <div className={globalStyles.cellUpperLabel}>
                                {course && <CourseLabel cid={course.cid} />}
                                {assignment && (
                                    <Typography className={globalStyles.assignmentLabel}>
                                        {(hasBoth && '/') + assignment.title}
                                    </Typography>
                                )}
                            </div>
                        )}
                        <div>{_.get(this.state, 'event.title')}</div>
                    </React.Fragment>
                );
            case 'section':
                return (
                    <React.Fragment>
                        {course && (
                            <div className={globalStyles.cellUpperLabel}>
                                <CourseLabel cid={course.cid} />
                            </div>
                        )}
                        <div>{_.get(this.state, 'event.title')}</div>
                    </React.Fragment>
                );
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
                    <ListItemText
                        primary={this.determinePrimaryFormatting(this.type)}
                        secondary={this.determineSecondaryFormatting(this.type)}
                    />
                </ListItem>
            </div>
        );
    }
}
OverviewCell.propTypes = {
    eid: PropTypes.string,
    selectAssignmentFromStore: PropTypes.func,
    selectTaskFromStore: PropTypes.func,
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectTaskFromStore: getTasksSelectors(state.tasks).selectById,
        selectAssignmentFromStore: getAssignmentsSelectors(state.assignments).selectById,
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
        getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateAssignment, updateAssignmentLocal, updateTask, updateTaskLocal };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCell);
