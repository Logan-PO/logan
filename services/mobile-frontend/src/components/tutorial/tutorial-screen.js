import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import LoginTutorial from './login-tutorial';

class Tutorial extends React.Component {
    render() {
        return (
            <ScrollView
                contentContainerStyle={{
                    height: Dimensions.get('screen').height * 2,
                    width: Dimensions.get('screen').width,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '10%',
                    paddingTop: '10%',
                }}
            >
                <LoginTutorial />
            </ScrollView>
        );
    }
}

export default Tutorial;
