import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Assignments from '../screens/assignments';
import Tasks from '../screens/tasks-screen';
import NewTaskModalStack from '../components/tasks/new-task-modal-stack';

const RootStack = createStackNavigator();
const BottomTabs = createMaterialBottomTabNavigator();

class NavigationHierarchy extends React.Component {
    tabs() {
        return (
            <BottomTabs.Navigator initialRouteName="Tasks" activeColor="teal" barStyle={{ backgroundColor: 'white' }}>
                <BottomTabs.Screen
                    tabBarIcon={({ color }) => <MaterialIcon name="check" color={color} size={26} />}
                    name="Tasks"
                    component={Tasks}
                />
                <BottomTabs.Screen
                    tabBarIcon={({ color }) => <MaterialIcon name="assignment" color={color} size={26} />}
                    name="Assignments"
                    component={Assignments}
                />
            </BottomTabs.Navigator>
        );
    }

    render() {
        return (
            <RootStack.Navigator mode="modal" headerMode="screen" screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="Root" component={this.tabs} />
                <RootStack.Screen name="New Task" component={NewTaskModalStack} />
            </RootStack.Navigator>
        );
    }
}

export default NavigationHierarchy;
