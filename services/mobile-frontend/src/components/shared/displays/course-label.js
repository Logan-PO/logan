import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import Typography from '../typography';

class CourseLabel extends React.Component {
    render() {
        const course = this.props.getCourse(this.props.cid) || {};
        const displayName = _.isEmpty(course.nickname) ? course.title : course.nickname;

        return (
            <Typography variant={this.props.variant || 'body2'} style={{ fontFamily: 'Rubik500' }} color={course.color}>
                {displayName}
            </Typography>
        );
    }
}

CourseLabel.propTypes = {
    cid: PropTypes.string,
    variant: PropTypes.string,
    getCourse: PropTypes.func,
};

const mapStateToProps = state => ({
    getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
});

export default connect(mapStateToProps, null)(CourseLabel);
