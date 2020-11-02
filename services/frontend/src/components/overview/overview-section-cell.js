import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getScheduleSelectors } from '../../store/schedule';

export class OverviewSectionCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            section: this.props.selectCourseFromStore(this.props.sid),
        };
    }

    render() {
        return <div className="list-cell">Hello</div>;
    }
}
OverviewSectionCell.propTypes = {
    sid: PropTypes.string,
    selectCourseFromStore: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectCourseFromStore: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
    };
};

export default connect(mapStateToProps, null)(OverviewSectionCell);
