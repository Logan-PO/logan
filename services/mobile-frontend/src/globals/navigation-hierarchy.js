import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AssignmentsScreen from '../screens/assignments';
import TasksScreen from '../components/tasks/tasks-screen';
import NewTaskModalStack from '../components/tasks/new-task-modal-stack';

const RootStack = createStackNavigator();
const BottomTabs = createMaterialBottomTabNavigator();

class NavigationHierarchy extends React.Component {
    tabs() {
        return (
            <BottomTabs.Navigator initialRouteName="Tasks" activeColor="teal" barStyle={{ backgroundColor: 'white' }}>
                <BottomTabs.Screen
                    name="Tasks"
                    component={TasksScreen}
                    tabBarIcon={({ color }) => <Icon name="check" color={color} size={26} />}
                />
                <BottomTabs.Screen
                    name="Assignments"
                    component={AssignmentsScreen}
                    tabBarIcon={({ color }) => <Icon name="assignment" color={color} size={26} />}
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
