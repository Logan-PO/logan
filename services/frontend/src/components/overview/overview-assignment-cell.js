import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from '@material-ui/core';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '../../store/assignments';
import { getScheduleSelectors } from '../../store/schedule';
import { CourseLabel } from '../shared/displays';
import globalStyles from '../../globals/global.scss';

export class OverviewAssignmentCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignment: this.props.selectAssignmentFromStore(this.props.aid),
        };
    }

    render() {
        const course = this.props.getCourse(_.get(this.state.assignment, 'cid'));

        return (
            <div className="list-cell">
                <ListItem>
                    <ListItemText
                        primary={
                            <React.Fragment>
                                {course && (
                                    <div className={globalStyles.cellUpperLabel}>
                                        <CourseLabel cid={course.cid} />
                                    </div>
                                )}
                                <div>{_.get(this.state, 'assignment.title')}</div>
                            </React.Fragment>
                        }
                        secondary={_.get(this.state, 'assignment.description')}
                    />
                </ListItem>
            </div>
        );
    }
}
OverviewAssignmentCell.propTypes = {
    aid: PropTypes.string,
    selectAssignmentFromStore: PropTypes.func,
    getCourse: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectAssignmentFromStore: getAssignmentsSelectors(state.assignments).selectById,
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
    };
};

const mapDispatchToProps = { updateAssignment, updateAssignmentLocal };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewAssignmentCell);
