import React from 'react';
import { View, Dimensions, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import Typography from '../shared/typography';
import NavigationButton from './navigation-button';

class AssignmentTutorial extends React.Component {
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
                        <Typography variant="h3">Assignments</Typography>
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
                            source={require('./images/assignment_overview.jpg')}
                        />
                    </View>
                    <View>
                        <Typography style={{ textAlign: 'center' }} variant="body">
                            {'\n'}You can find all your assignments on this screen. Toggling the past-upcoming bar at
                            the top of the screen switches from displaying previous assignments and future assignments.
                            Pressing on an existing assignment or hitting the + button brings up the assignment editor.
                            {'\n'}
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
                            source={require('./images/assignment_editor.jpg')}
                        />
                    </View>
                    <View>
                        <Typography style={{ textAlign: 'center' }} variant="body">
                            {'\n'}In the assignment editor, you can change the name of an assignment, its description,
                            give it a due date, and associate it with a course. You can add tasks associated with this
                            assignment, which are displayed on screen.
                            {'\n'}
                        </Typography>
                    </View>
                    <View>
                        <NavigationButton destination="Task Tutorial" text="Next" navigation={this.props.navigation} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

AssignmentTutorial.propTypes = {
    navigation: PropTypes.object,
};

export default AssignmentTutorial;
