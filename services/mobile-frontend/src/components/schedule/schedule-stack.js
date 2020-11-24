import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TermsList from './terms-list';

const Stack = createStackNavigator();

const ScheduleStack = () => (
    <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Terms" component={TermsList} />
    </Stack.Navigator>
);

export default ScheduleStack;
