import React from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { connect } from 'react-redux';
import { LOGIN_STAGE, setLoginStage, verifyIdToken } from '@logan/fe-shared/store/login';
import PropTypes from 'prop-types';
import { typographyStyles } from '../shared/typography';

const ANDROID_CLIENT_ID = '850674143860-73rdeqg9n24do0on8ghbklcpgjft1c7v.apps.googleusercontent.com';
const IOS_CLIENT_ID = '850674143860-mqhkuritdvkmiq53h9963rjmn5gamsgb.apps.googleusercontent.com';
const CLIENT_ID = Platform.OS === 'ios' ? IOS_CLIENT_ID : ANDROID_CLIENT_ID;
const DEVICE = Platform.OS === 'ios' ? 'ios' : 'android';
const config = { clientId: CLIENT_ID };

class MobileLoginButton extends React.Component {
    constructor(props) {
        super(props);

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);

        this.state = {
            isLoggingIn: false,
        };
    }

    async signIn() {
        this.setState({ isLoggingIn: true });
        try {
            await GoogleSignin.hasPlayServices();
            const { type, idToken } = await GoogleSignin.signIn();
        } catch (error) {
            alert('Login Failed');
        }
        if (type === 'success') {
            await this.props.verifyIdToken({ idToken: idToken, clientType: DEVICE });
        }
        this.setState({ isLoggingIn: false });
    }

    async signOut() {
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
    }

    render() {
        if (this.props.isLoggedIn) {
            return (
                <Button
                    labelStyle={typographyStyles.button}
                    style={this.props.style}
                    color={this.props.color}
                    mode={this.props.mode}
                    onPress={this.signOut}
                >
                    Logout
                </Button>
            );
        } else {
            if (this.state.isLoggingIn) {
                return <ActivityIndicator animating={true} color="white" size="large" />;
            } else {
                return (
                    <GoogleSigninButton
                        style={{ width: 192, height: 48 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={this.signIn}
                    />
                );
            }
        }
    }
}

MobileLoginButton.propTypes = {
    isLoggedIn: PropTypes.bool,
    setLoginStage: PropTypes.func,
    verifyIdToken: PropTypes.func,
    mode: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
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
