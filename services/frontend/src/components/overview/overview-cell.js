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
        this.type = this.props.selectAssignmentFromStore(this.props.eid) === null ? 'task' : 'assignment';
        this.state = {
            event:
                this.type === 'assignment'
                    ? this.props.selectAssignmentFromStore(this.props.eid)
                    : this.props.selectTaskFromStore(this.props.eid),
        };
    }

    render() {
        const assignment = this.props.getAssignment(_.get(this.state.task, 'aid'));
        const course = assignment
            ? this.props.getCourse(assignment.cid)
            : this.props.getCourse(_.get(this.state.task, 'cid'));

        const needsUpperLabel = course || assignment;
        const hasBoth = course && assignment;
        return (
            <div className="list-cell">
                <ListItem>
                    <ListItemText
                        primary={
                            this.type === 'assignment' ? (
                                <React.Fragment>
                                    {course && (
                                        <div className={globalStyles.cellUpperLabel}>
                                            <CourseLabel cid={course.cid} />
                                        </div>
                                    )}
                                    <div>{_.get(this.state, 'assignment.title')}</div>
                                </React.Fragment>
                            ) : (
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
                                    <div>{_.get(this.state, 'task.title')}</div>
                                </React.Fragment>
                            )
                        }
                        secondary={
                            this.type === 'assignment'
                                ? _.get(this.state, 'assignment.description')
                                : _.get(this.state, 'task.description')
                        }
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
