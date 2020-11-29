import React from 'react';
import { Image } from 'react-native';
import { View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../shared/typography';

class LoginTutorial extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let scale = 0.8;
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Typography variant="h3">Login</Typography>
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
                        source={require('./images/login_screen.jpg')}
                    />
                </View>
                <View>
                    <Typography style={{ textAlign: 'center' }} variant="body">
                        {'\n'}To login with Logan, just press the login button, and follow the on-screen instructions.
                        If you are a new user, input your name, desired username, and email in the create user page (see
                        below). Once completed, you should be taken to the Overview page. {'\n'}
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
                        source={require('./images/create_account.jpg')}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default LoginTutorial;
