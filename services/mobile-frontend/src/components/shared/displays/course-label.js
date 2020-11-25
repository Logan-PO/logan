import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from 'react-native-paper';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import { typographyStyles } from '../typography';

class CourseLabel extends React.Component {
    render() {
        const course = this.props.getCourse(this.props.cid) || {};
        const displayName = _.isEmpty(course.nickname) ? course.title : course.nickname;

        return (
            <Text
                style={{
                    ...typographyStyles.body2,
                    fontWeight: 'bold',
                    color: course.color,
                }}
            >
                {displayName}
            </Text>
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
