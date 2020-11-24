import React from 'react';
import { Text } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import { connect } from 'react-redux';
import { setLoginStage, verifyIdToken } from '@logan/fe-shared/store/login';

const ANDROID_CLIENT_ID = '850674143860-73rdeqg9n24do0on8ghbklcpgjft1c7v.apps.googleusercontent.com';
const DEVICE = 'android';

class MobileLoginButton extends React.Component {
    constructor(props) {
        super(props);
    }

    async signIn() {}

    async signOut() {}

    onPress() {}

    render() {
        return <Text onPress={this.onPress}>Toggle Auth</Text>;
    }
}

/*
This is from react-redux
When the state gets updated, so do the props
 */
const mapStateToProps = state => ({
    isLoggedIn: state.login.isLoggedIn,
});

/*
When we update the props, dispatch to the state
 */
const mapDispatchToProps = {
    setLoginStage,
    verifyIdToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileLoginButton);
