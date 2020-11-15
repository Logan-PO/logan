import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Assignments from '../screens/assignments';
import Tasks from '../screens/tasks-screen';

const Tab = createMaterialBottomTabNavigator();

class NavigationManager extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator initialRouteName="Tasks" activeColor="teal" barStyle={{ backgroundColor: 'white' }}>
                    <Tab.Screen
                        tabBarIcon={({ color }) => <MaterialIcon name="check" color={color} size={26} />}
                        name="Tasks"
                        component={Tasks}
                    />
                    <Tab.Screen
                        tabBarIcon={({ color }) => <MaterialIcon name="assignment" color={color} size={26} />}
                        name="Assignments"
                        component={Assignments}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}

export default NavigationManager;
