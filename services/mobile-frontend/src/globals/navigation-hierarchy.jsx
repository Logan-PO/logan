import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TasksScreen from '../components/tasks/tasks-screen';
import AssignmentsScreen from '../components/assignments/assignments-screen';
import ScheduleStack from '../components/schedule/schedule-stack';
import NewTaskModalStack from '../components/tasks/new-task-modal-stack';
import NewAssignmentModalStack from '../components/assignments/new-assignment-modal-stack';
import NewTermModal from '../components/schedule/terms/new-term-modal';
import NewCourseModal from '../components/schedule/courses/new-course-modal';
import NewHolidayModal from '../components/schedule/holidays/new-holiday-modal';
import Home from '../components/home/home';
import SignUpForm from '../components/home/signup-form';
import OverviewScreen from '../components/overview/overview-screen';
import NewSectionModal from '../components/schedule/sections/new-section-modal';
import SettingsScreen from '../components/settings/settings-screen';
import ReminderDisplay from '../components/reminders/reminder-display';
import NewReminderModal from '../components/reminders/new-reminder-modal';
import TutorialViewer from '../components/tutorial/tutorial-viewer';
import { getCurrentTheme } from './theme';
import { LOGIN_STAGE } from 'packages/fe-shared/store/login';

const RootStack = createStackNavigator();
const BottomTabs = createMaterialBottomTabNavigator();

const routes = [
    {
        name: 'Overview',
        icon: 'home',
        component: OverviewScreen,
    },
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

const InternalTabBar = () => {
    const theme = getCurrentTheme();

    return (
        <BottomTabs.Navigator
            initialRouteName="Overview"
            activeColor={theme.colors.primary}
            barStyle={{ backgroundColor: 'white' }}
            screenOptions={({ route }) => ({
                // eslint-disable-next-line react/prop-types,react/display-name
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
};

const mapStateToTabs = state => ({
    user: state.login.user,
});

const TabBar = connect(mapStateToTabs, null)(InternalTabBar);

class NavigationHierarchy extends React.Component {
    render() {
        return (
            <RootStack.Navigator mode="modal" headerMode="screen" screenOptions={{ headerShown: false }}>
                {this.props.loginStage === LOGIN_STAGE.DONE ? (
                    <React.Fragment>
                        <RootStack.Screen name="Root" component={TabBar} />
                        <RootStack.Screen name="New Task" component={NewTaskModalStack} />
                        <RootStack.Screen name="New Assignment" component={NewAssignmentModalStack} />
                        <RootStack.Screen name="New Term" component={NewTermModal} />
                        <RootStack.Screen name="New Course" component={NewCourseModal} />
                        <RootStack.Screen name="New Holiday" component={NewHolidayModal} />
                        <RootStack.Screen name="New Section" component={NewSectionModal} />
                        <RootStack.Screen name="New Reminder" component={NewReminderModal} />
                        <RootStack.Screen name="Edit Reminder" component={ReminderDisplay} />
                        <RootStack.Screen name="Settings" component={SettingsScreen} />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <RootStack.Screen name="Home" component={Home} />
                        <RootStack.Screen name="Signup" component={SignUpForm} />
                    </React.Fragment>
                )}
                <RootStack.Screen name="Tutorial Root" component={TutorialViewer} />
            </RootStack.Navigator>
        );
    }
}

NavigationHierarchy.propTypes = {
    loginStage: PropTypes.string,
};

const mapStateToProps = state => ({
    loginStage: state.login.currentStage,
});

export default connect(mapStateToProps, null)(NavigationHierarchy);
