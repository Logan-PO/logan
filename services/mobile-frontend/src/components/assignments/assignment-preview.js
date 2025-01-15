import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'react-native-paper';
import CourseLabel from '../shared/displays/course-label';
import Typography from '../shared/typography';
import ListItem from '../shared/list-item';
import { dateUtils } from 'packages/core';

const AssignmentPreview = ({ assignment, ...rest }) => (
    <ListItem
        {...rest}
        leftContent={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 50, alignItems: 'center' }}>
                    <Icon name="assignment" size={22} color={Colors.grey500} />
                </View>
                <View>
                    {assignment.cid && <CourseLabel variant="caption" cid={assignment.cid} />}
                    <Typography variant="body2">{assignment.title}</Typography>
                    <Typography variant="body2" color="secondary">
                        Due {dateUtils.readableDueDate(assignment.dueDate, { forSentence: true })}
                    </Typography>
                </View>
            </View>
        }
        contentStyle={{ paddingLeft: 0 }}
        showRightArrow
    />
);

AssignmentPreview.propTypes = {
    assignment: PropTypes.object,
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default AssignmentPreview;
