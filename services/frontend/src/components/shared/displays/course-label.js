import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { getScheduleSelectors } from '../../../store/schedule';

class CourseLabel extends React.Component {
    render() {
        const course = this.props.getCourse(this.props.cid);
        const displayName = _.isEmpty(course.nickname) ? course.title : course.nickname;

        return (
            <Typography className="course-label" style={{ color: course.color }}>
                {displayName}
            </Typography>
        );
    }
}

CourseLabel.propTypes = {
    cid: PropTypes.string,
    getCourse: PropTypes.func,
};

const mapStateToProps = state => ({
    getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
});

export default connect(mapStateToProps, null)(CourseLabel);
