import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CoursePicker from '../shared/pickers/course-picker';
import PriorityPicker from '../shared/pickers/priority-picker';
import NewAssignmentModal from './new-assignment-modal';

const Stack = createStackNavigator();

export default function NewAssignmentModalStack() {
    return (
        <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="New Assignment" component={NewAssignmentModal} />
            <Stack.Screen name="Course Picker" component={CoursePicker} />
            <Stack.Screen name="Priority Picker" component={PriorityPicker} />
        </Stack.Navigator>
    );
}
