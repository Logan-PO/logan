import React from 'react';
import { Button } from 'react-native';
import * as Google from 'expo-google-app-auth';
import { connect } from 'react-redux';
import { LOGIN_STAGE, setLoginStage, verifyIdToken } from '@logan/fe-shared/store/login';
import PropTypes from 'prop-types';
import api from '@logan/fe-shared/utils/api';

const ANDROID_CLIENT_ID = '850674143860-73rdeqg9n24do0on8ghbklcpgjft1c7v.apps.googleusercontent.com';
const DEVICE = 'android';
const config = { clientId: ANDROID_CLIENT_ID };

class MobileLoginButton extends React.Component {
    constructor(props) {
        super(props);

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.onPress = this.onPress.bind(this);
        this.initAsync = this.initAsync.bind(this);
    }

    componentDidMount() {
        this.initAsync();
    }

    async initAsync() {}

    async signIn() {
        const { type, accessToken, idToken, user } = await Google.logInAsync(config);
        if (type === 'success') {
            console.log(user);
            console.log(idToken);
        }
    }

    async signOut(accessToken) {
        await Google.logOutAsync({ accessToken, ...config });
        api.setBearerToken(undefined);
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
    }

    onPress() {
        this.signIn();
    }

    render() {
        return <Button title="login" onPress={this.onPress} />;
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
