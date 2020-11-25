import _ from 'lodash';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AssignmentsScreen from '../screens/assignments';
import TasksScreen from '../components/tasks/tasks-screen';
import NewTaskModalStack from '../components/tasks/new-task-modal-stack';
import ScheduleStack from '../components/schedule/schedule-stack';
import NewTermModal from '../components/schedule/terms/new-term-modal';
import NewCourseModal from '../components/schedule/courses/new-course-modal';

const RootStack = createStackNavigator();
const BottomTabs = createMaterialBottomTabNavigator();

const routes = [
    {
        name: 'Tasks',
        icon: 'check-box',
        component: TasksScreen,
    },
    {
        name: 'Assignments',
        icon: 'assignment',
        component: AssignmentsScreen,
    },
    {
        name: 'Schedule',
        icon: 'today',
        component: ScheduleStack,
    },
];

class NavigationHierarchy extends React.Component {
    tabs() {
        return (
            <BottomTabs.Navigator
                initialRouteName="Tasks"
                activeColor="teal"
                barStyle={{ backgroundColor: 'white' }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => {
                        const iconName = _.find(routes, navigationRoute => navigationRoute.name === route.name).icon;
                        return <Icon name={iconName} size={22} color={color} />;
                    },
                })}
            >
                {routes.map(({ name, component }) => (
                    <BottomTabs.Screen key={name} name={name} component={component} />
                ))}
            </BottomTabs.Navigator>
        );
    }

    render() {
        return (
            <RootStack.Navigator mode="modal" headerMode="screen" screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="Root" component={this.tabs} />
                <RootStack.Screen name="New Task" component={NewTaskModalStack} />
                <RootStack.Screen name="New Term" component={NewTermModal} />
                <RootStack.Screen name="New Course" component={NewCourseModal} />
            </RootStack.Navigator>
        );
    }
}

export default NavigationHierarchy;
