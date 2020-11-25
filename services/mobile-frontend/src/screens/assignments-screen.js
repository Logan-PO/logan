import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssignments, getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { createStackNavigator } from '@react-navigation/stack';
import AssignmentList from '../components/assignments/assignments-list';
import AssignmentDetails from '../components/assignments/assignment-details';
import CoursePicker from '../components/shared/pickers/course-picker';
import PriorityPicker from '../components/shared/pickers/priority-picker';

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
