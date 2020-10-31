import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Assignments from '../pages/assignments';
import Tasks from '../pages/tasks';

const Stack = createStackNavigator();

const navigationManager = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={'Assignments'} component={Assignments} options={{ title: 'Assignments' }} />
                <Stack.Screen name={'Tasks'} component={Tasks} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default navigationManager();
