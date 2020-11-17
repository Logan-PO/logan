import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CoursePicker from '../shared/pickers/course-picker';
import PriorityPicker from '../shared/pickers/priority-picker';
import NewTaskModal from './new-task-modal';

const Stack = createStackNavigator();

export default function NewTaskModalStack() {
    return (
        <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="New Task" component={NewTaskModal} />
            <Stack.Screen name="Course Picker" component={CoursePicker} />
            <Stack.Screen name="Priority Picker" component={PriorityPicker} />
        </Stack.Navigator>
    );
}
