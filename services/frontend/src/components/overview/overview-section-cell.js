import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '../../store/assignments';
import { getScheduleSelectors } from '../../store/schedule';

export class OverviewSectionCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignment: this.props.selectAssignmentFromStore(this.props.aid),
        };
    }

    render() {
        return <div className="list-cell">Hello</div>;
    }
}
OverviewSectionCell.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(OverviewSectionCell);
