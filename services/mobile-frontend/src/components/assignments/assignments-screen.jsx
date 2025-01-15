import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import CoursePicker from '../shared/pickers/course-picker';
import PriorityPicker from '../shared/pickers/priority-picker';
import AssignmentList from './assignments-list';
import AssignmentDetails from './assignment-details';
import { fetchAssignments, getAssignmentsSelectors } from 'packages/fe-shared/store/assignments';

const Stack = createStackNavigator();

class AssignmentsScreen extends React.Component {
    render() {
        return (
            <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Assignments" component={AssignmentList} />
                <Stack.Screen name="Assignment" component={AssignmentDetails} />
                <Stack.Screen name="Course Picker" component={CoursePicker} />
                <Stack.Screen name="Priority Picker" component={PriorityPicker} />
            </Stack.Navigator>
        );
    }
}

AssignmentsScreen.propTypes = {
    assignments: PropTypes.array,
    fetchAssignments: PropTypes.func,
};

const mapStateToProps = state => ({
    assignments: getAssignmentsSelectors(state.assignments).selectAll(),
});

const mapDispatchToProps = {
    fetchAssignments,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsScreen);
