import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TaskDetails from '../tasks/task-details';
import AssignmentDetails from '../assignments/assignment-details';
import CoursePicker from '../shared/pickers/course-picker';
import PriorityPicker from '../shared/pickers/priority-picker';
import OverviewList from './overview-list';

const Stack = createStackNavigator();

class OverviewScreen extends React.Component {
    render() {
        return (
            <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Overview" component={OverviewList} />
                <Stack.Screen name="Assignment" component={AssignmentDetails} />
                <Stack.Screen name="Task" component={TaskDetails} />
                <Stack.Screen name="Course Picker" component={CoursePicker} />
                <Stack.Screen name="Priority Picker" component={PriorityPicker} />
            </Stack.Navigator>
        );
    }
}

export default OverviewScreen;
