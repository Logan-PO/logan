import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Assignments from '../screens/assignments';
import Tasks from '../screens/tasks-screen';
import Home from '../screens/home';

const Stack = createStackNavigator();

export default class NavigationManager extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name={'Home'} component={Home} />
                    <Stack.Screen name={'Assignments'} component={Assignments} />
                    <Stack.Screen name={'Tasks'} component={Tasks} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
