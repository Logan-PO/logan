import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CoursePicker from '../shared/pickers/course-picker';
import PriorityPicker from '../shared/pickers/priority-picker';
import AssignmentDetails from '../assignments/assignment-details';
import TasksList from './tasks-list';
import TaskDetails from './task-details';

const Stack = createStackNavigator();

class TasksScreen extends React.Component {
    render() {
        return (
            <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tasks" component={TasksList} />
                <Stack.Screen name="Task" component={TaskDetails} />
                <Stack.Screen name="Assignment" component={AssignmentDetails} />
                <Stack.Screen name="Course Picker" component={CoursePicker} />
                <Stack.Screen name="Priority Picker" component={PriorityPicker} />
            </Stack.Navigator>
        );
    }
}

export default TasksScreen;
