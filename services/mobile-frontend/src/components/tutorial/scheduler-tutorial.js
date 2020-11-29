import React from 'react';
import { View, Dimensions, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import Typography from '../shared/typography';
import NavigationButton from './navigation-button';

class SchedulerTutorial extends React.Component {
    render() {
        let scale = 0.8;
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ScrollView
                    contentContainerStyle={{
                        height: Dimensions.get('screen').height * 3,
                        width: Dimensions.get('screen').width,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View>
                        <Typography variant="h3">Schedule</Typography>
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
                            source={require('./images/scheduler_screen.jpg')}
                        />
                    </View>
                    <View>
                        <Typography style={{ textAlign: 'center' }} variant="body">
                            {'\n'}The Schedule page is where you can manage your terms, classes, and sections. By
                            pressing a term or the + button, you can edit a term. {'\n'}
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
                            source={require('./images/term_editor.jpg')}
                        />
                    </View>
                    <View>
                        <Typography style={{ textAlign: 'center' }} variant="body">
                            {'\n'}Once in the term editor, you can see a list of courses. Pressing the + button will add
                            either a new course or holiday, which you can then edit.{'\n'}
                        </Typography>
                    </View>
                    <View>
                        <Image
                            style={{
                                width: Dimensions.get('screen').width * scale,
                                height: Dimensions.get('screen').height * scale,
                            }}
                            source={require('./images/course_editor.jpg')}
                        />
                    </View>
                    <View>
                        <Typography style={{ textAlign: 'center' }} variant="body">
                            {'\n'}In the course editor, you can change the course name, course nickname, and color. You
                            can also edit and add sections for the course.{'\n'}
                        </Typography>
                    </View>
                    <View>
                        <NavigationButton
                            destination="Assignment Tutorial"
                            text="Next"
                            navigation={this.props.navigation}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

SchedulerTutorial.propTypes = {
    navigation: PropTypes.object,
};

export default SchedulerTutorial;
