import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const navigationManager = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator></Stack.Navigator>
        </NavigationContainer>
    );
};

export default navigationManager();
