import React from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { typographyStyles } from '../shared/typography';
import { LOGIN_STAGE, setLoginStage, verifyIdToken } from 'packages/fe-shared/store/login';

const ANDROID_CLIENT_ID = '850674143860-3sg0du8iqknfanigev1kl65c35isb1s2.apps.googleusercontent.com';
const IOS_CLIENT_ID = '850674143860-mqhkuritdvkmiq53h9963rjmn5gamsgb.apps.googleusercontent.com';
const DEVICE = Platform.OS === 'ios' ? 'ios' : 'android';
const WEB_CLIENT_ID = '850674143860-fjg7l5bmbs7o6v7lp35a4nfqs4guc6o5.apps.googleusercontent.com';
const CLIENT_ID = DEVICE === 'ios' ? IOS_CLIENT_ID : WEB_CLIENT_ID; //IOS wants its id to be the webID ?

class MobileLoginButton extends React.Component {
    constructor(props) {
        super(props);

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);

        GoogleSignin.configure({
            androidClientId: ANDROID_CLIENT_ID,
            webClientId: CLIENT_ID,
        });

        this.state = {
            isLoggingIn: false,
        };
    }

    async signIn() {
        this.setState({ isLoggingIn: true });

        try {
            await GoogleSignin.hasPlayServices();
            const { idToken } = await GoogleSignin.signIn();
            await this.props.verifyIdToken({ idToken: idToken, clientType: DEVICE });
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('Google Sign-in cancelled by user');
                this.setState({ isLoggingIn: false });
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Google Sign-in already in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available');
                this.setState({ isLoggingIn: false });
            } else {
                this.setState({ isLoggingIn: false });
                throw error;
            }
        }
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
                        color={GoogleSigninButton.Color.Light}
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
