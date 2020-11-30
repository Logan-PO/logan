import React from 'react';
import { View, Dimensions, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import Typography from '../shared/typography';
import NavigationButton from './navigation-button';

class TasksTutorial extends React.Component {
    render() {
        let scale = 0.8;
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ScrollView
                    contentContainerStyle={{
                        height: Dimensions.get('screen').height * 2.2,
                        width: Dimensions.get('screen').width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View>
                        <Typography variant="h3">Tasks</Typography>
                    </View>
                    <View
                        style={{
                            width: Dimensions.get('screen').width * scale,
                            height: Dimensions.get('screen').height * scale,
                        }}
                    >
                        <Image
                            style={{
                                width: Dimensions.get('screen').width * scale,
                                height: Dimensions.get('screen').height * scale,
                            }}
                            source={require('./images/task_overview.jpg')}
                        />
                    </View>
                    <View>
                        <Typography style={{ textAlign: 'center' }} variant="body">
                            {'\n'}The tasks page displays tasks. Toggling the bar at the top changes the display from
                            upcoming tasks to completed tasks. Pressing the box next to a task marks that task as
                            completed. Swiping left on a task opens up an option to delete that task, or, if the task is
                            overdue, to change the task due-date to today. Clicking the + button or an existing tasks
                            brings up the task editor.{'\n'}
                        </Typography>
                    </View>
                    <View
                        style={{
                            width: Dimensions.get('screen').width * scale,
                            height: Dimensions.get('screen').height * scale,
                        }}
                    >
                        <Image
                            style={{
                                width: Dimensions.get('screen').width * scale,
                                height: Dimensions.get('screen').height * scale,
                            }}
                            source={require('./images/task_editor.jpg')}
                        />
                    </View>
                    <View>
                        <Typography style={{ textAlign: 'center' }} variant="body">
                            {'\n'}In the task editor, you can change the title, add a description, set a due date,
                            associate with a course, or set the priority of this task.{'\n'}
                        </Typography>
                    </View>
                    <View>
                        <NavigationButton destination="Home" text="Done" navigation={this.props.navigation} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

TasksTutorial.propTypes = {
    navigation: PropTypes.object,
};

export default TasksTutorial;
