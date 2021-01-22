import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import api from '@logan/fe-shared/utils/api';
import { verifyIdToken, LOGIN_STAGE, setLoginStage } from '@logan/fe-shared/store/login';
import { LinearProgress } from '@material-ui/core';

const clientID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';

//A component for the google sign in button
class GoogleBtn extends React.Component {
    constructor(props) {
        super(props);

        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);

        this.state = { loggingIn: false };
    }

    componentDidMount() {
        this.setState({ loggingIn: false });
    }

    /*
     When we successfully login with the button, make a call to the backend.
     If all conditions are met, then create a login action and update the state
     */
    async onLogin(response) {
        this.setState({ loggingIn: true });
        await this.props.verifyIdToken({ idToken: response.tokenId, clientType: 'web' });
    }

    async onLogout() {
        api.setBearerToken(undefined);
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
    }

    /*
    Rendering the button and giving appropriate methods to be called on success and failure
     */
    render() {
        if (this.props.isLoggedIn) {
            return (
                <GoogleLogout
                    clientId={clientID}
                    buttonText="Logout"
                    onLogoutSuccess={this.onLogout}
                    onFailure={handleLogoutFailure}
                    {...this.props.logoutProps}
                />
            );
        } else if (this.state.loggingIn) {
            return <LinearProgress />;
        } else {
            return (
                <GoogleLogin
                    clientId={clientID}
                    onSuccess={this.onLogin}
                    onFailure={handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    {...this.props.loginProps}
                />
            );
        }
    }
}

GoogleBtn.propTypes = {
    loginProps: PropTypes.object,
    logoutProps: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    setLoginStage: PropTypes.func,
    verifyIdToken: PropTypes.func,
};

//If we fail to log in, print the response
function handleLoginFailure(response) {
    console.log(response);
}

//If we fail to log out, print the response
function handleLogoutFailure(response) {
    console.log(response);
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

/*
Connecting the button to the state and exporting the button
 */
export default connect(mapStateToProps, mapDispatchToProps)(GoogleBtn);
