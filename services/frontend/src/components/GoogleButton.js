import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { navigate } from 'gatsby';
import { setBearerToken } from '../utils/api';
import { login, logout } from './GoogleStore';

//Necessary to use the google button
const clientID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';
//URI for the backend
const BASE_URI = 'http://logan-backend-dev.us-west-2.elasticbeanstalk.com';
const AUTH_ROUTE = '/auth/verify';
const USER_ROUTE = '/users';

//A component for the google sign in button
class GoogleBtn extends React.Component {
    constructor(props) {
        super(props);

        this.onLogin = this.onLogin.bind(this);
        this.handleBearer = this.handleBearer.bind(this);
    }

    async handleBearer(res) {
        if (res.exists) {
            setBearerToken(res.token);
        } else {
            //await axios.post(BASE_URI + USER_ROUTE, { res.token });
            console.log('gotta make a user now');
        }
    }

    /*
     When we successfully login with the button, make a call to the backend.
     If all conditions are met, then create a login action and update the state
     */
    async onLogin(response) {
        let login = this.props.login;
        axios
            .post(BASE_URI + AUTH_ROUTE, { idToken: response.tokenId })
            .then(res => {
                console.log(res);
                this.handleBearer(res);
                login();
                navigate('../');
            })
            .catch(error => {
                console.log(error);
            });
    }

    /*
    Rendering the button and giving appropriate methods to be called on success and failure
     */
    render() {
        let isLoggedIn = this.props.isLoggedIn;
        let logout = this.props.logout;
        return (
            <div>
                {isLoggedIn ? (
                    //Logout button and fields
                    <GoogleLogout
                        clientId={clientID}
                        buttonText="Logout"
                        onLogoutSuccess={logout}
                        onFailure={handleLogoutFailure}
                    >
                        {}
                    </GoogleLogout>
                ) : (
                    //Login button and fields
                    <GoogleLogin
                        clientId={clientID}
                        buttonText="Login"
                        onSuccess={this.onLogin}
                        onFailure={handleLoginFailure}
                        cookiePolicy={'single_host_origin'}
                        //responseType="code,token"
                    >
                        {}
                    </GoogleLogin>
                )}
            </div>
        );
    }
}

GoogleBtn.propTypes = {
    isLoggedIn: PropTypes.any,
    login: PropTypes.any,
    logout: PropTypes.any,
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
    isLoggedIn: state.isLoggedIn,
});

/*
When we update the props, dispatch to the state
 */
const mapDispatchToProps = {
    login,
    logout,
};

/*
Connecting the button to the state and exporting the button
 */
export default connect(mapStateToProps, mapDispatchToProps)(GoogleBtn);
