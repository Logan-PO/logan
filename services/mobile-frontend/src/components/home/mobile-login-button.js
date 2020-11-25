import React from 'react';
import { Text } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import { connect } from 'react-redux';
import { LOGIN_STAGE, setLoginStage, verifyIdToken } from '@logan/fe-shared/store/login';
import PropTypes from 'prop-types';
import api from '@logan/fe-shared/utils/api';

const ANDROID_CLIENT_ID = '850674143860-73rdeqg9n24do0on8ghbklcpgjft1c7v.apps.googleusercontent.com';
const DEVICE = 'android';

class MobileLoginButton extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.initAsync();
    }

    async initAsync() {
        await GoogleSignIn.initAsync({
            // You may ommit the clientId when the firebase `googleServicesFile` is configured
            clientId: ANDROID_CLIENT_ID,
        });
    }

    async signIn() {
        try {
            //This should pop up a modal (only on android) to update google play services if
            //they aren't already up to date
            await GoogleSignIn.askForPlayServicesAsync();
            //Grabbing user data from sign in
            const { type, user } = await GoogleSignIn.signInAsync();
            console.log(user);
            if (type === 'success') {
                //Verifying the ID token on a successful login
                //this.props.verifyIdToken({ idToken: user.auth.idToken, clientType: DEVICE });
            }
        } catch ({ message }) {
            console.log(`Login Error: ${message}`);
        }
    }

    async signOut() {
        await GoogleSignIn.signOutAsync();
        api.setBearerToken(undefined);
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
    }

    onPress() {}

    render() {
        return <Text onPress={this.onPress}>Toggle Auth</Text>;
    }
}

MobileLoginButton.propTypes = {
    isLoggedIn: PropTypes.bool,
    setLoginStage: PropTypes.func,
    verifyIdToken: PropTypes.func,
};

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
