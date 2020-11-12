import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from '@material-ui/core';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '@logan/fe-shared/store/assignments';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import { CourseLabel } from '../shared/displays';
import globalStyles from '../../globals/global.scss';

export class OverviewAssignmentCell extends React.Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.state = {
            assignment: this.props.selectAssignmentFromStore(this.props.aid),
        };
    }
    select() {
        if (this.props.onSelect) this.props.onSelect(this.props.aid);
    }

    render() {
        const course = this.props.getCourse(_.get(this.state.assignment, 'cid'));

        return (
            <div className="list-cell">
                <ListItem button selected={this.props.selected} onClick={this.select}>
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
                    />
                </ListItem>
            </div>
        );
    }
}
OverviewAssignmentCell.propTypes = {
    onSelect: PropTypes.func,
    selected: PropTypes.bool,
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
