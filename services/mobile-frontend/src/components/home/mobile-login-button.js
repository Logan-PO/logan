import React from 'react';
import { Button } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { connect } from 'react-redux';
import { LOGIN_STAGE, setLoginStage, verifyIdToken } from '@logan/fe-shared/store/login';
import PropTypes from 'prop-types';

const ANDROID_CLIENT_ID = '850674143860-73rdeqg9n24do0on8ghbklcpgjft1c7v.apps.googleusercontent.com';
const DEVICE = 'android';
const config = { clientId: ANDROID_CLIENT_ID };

class MobileLoginButton extends React.Component {
    constructor(props) {
        super(props);

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    async signIn() {
        const { type, accessToken, idToken, user } = await Google.logInAsync(config);
        if (type === 'success') {
            console.log(user);
            console.log(idToken);
            await this.props.verifyIdToken({ idToken: idToken, clientType: DEVICE });
        }
    }

    async signOut() {
        //await Google.logOutAsync({ accessToken, ...config });
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
    }

    render() {
        if (this.props.isLoggedIn) {
            return <Button title="Logout" onPress={this.signIn} />;
        } else {
            return <Button title="Login with Google" onPress={this.signOut} />;
        }
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
