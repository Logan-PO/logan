import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Assignments from '../pages/assignments';
import Tasks from '../pages/tasks';

const Tab = createMaterialBottomTabNavigator();

class NavigationManager extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Tasks" component={Tasks} />
                    <Tab.Screen name="Assignments" component={Assignments} />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}

export default NavigationManager;
