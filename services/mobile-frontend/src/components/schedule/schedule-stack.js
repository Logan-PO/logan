import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TermsList from './terms/terms-list';
import TermDisplay from './terms/term-display';
import CourseDisplay from './courses/course-display';
import HolidayDisplay from './holidays/holiday-display';
import SectionDisplay from './sections/section-display';

const Stack = createStackNavigator();

const ScheduleStack = () => (
    <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Terms" component={TermsList} />
        <Stack.Screen name="Term" component={TermDisplay} />
        <Stack.Screen name="Course" component={CourseDisplay} />
        <Stack.Screen name="Holiday" component={HolidayDisplay} />
        <Stack.Screen name="Section" component={SectionDisplay} />
    </Stack.Navigator>
);

export default ScheduleStack;
