import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchTasks, getTasksSelectors } from '@logan/fe-shared/store/tasks';
import { createStackNavigator } from '@react-navigation/stack';
import TasksList from '../components/tasks/tasks-list';
import TaskDetails from '../components/tasks/task-details';
import TasksAppbar from '../components/shared/header';
import CoursePicker from '../components/shared/pickers/course-picker';
import PriorityPicker from '../components/shared/pickers/priority-picker';

const Stack = createStackNavigator();

class TasksScreen extends React.Component {
    render() {
        return (
            <Stack.Navigator
                headerMode="screen"
                screenOptions={{
                    header: ({ scene, previous, navigation }) => (
                        <TasksAppbar scene={scene} previous={previous} navigation={navigation} />
                    ),
                }}
            >
                <Stack.Screen name="Tasks" component={TasksList} />
                <Stack.Screen name="Task" component={TaskDetails} />
                <Stack.Screen name="Course Picker" component={CoursePicker} />
                <Stack.Screen name="Priority Picker" component={PriorityPicker} />
            </Stack.Navigator>
        );
    }
}

TasksScreen.propTypes = {
    tasks: PropTypes.array,
    fetchTasks: PropTypes.func,
};

const mapStateToProps = state => ({
    tasks: getTasksSelectors(state.tasks).selectAll(),
});

const mapDispatchToProps = {
    fetchTasks,
};

export default connect(mapStateToProps, mapDispatchToProps)(TasksScreen);
