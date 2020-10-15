import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MenuItem } from '@material-ui/core';
import { getScheduleSelectors } from '../../../../store/schedule';

class CoursePickerItem extends React.Component {
    render() {
        const course = this.props.getCourseById(this.props.cid);
        return (
            <MenuItem value={this.props.cid} style={{ color: course.color }}>
                {course.title}
            </MenuItem>
        );
    }
}

CoursePickerItem.propTypes = {
    cid: PropTypes.string,
    getCourseById: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);
    return {
        getCourseById: selectors.baseSelectors.courses.selectById,
    };
};

export default connect(mapStateToProps, null)(CoursePickerItem);
