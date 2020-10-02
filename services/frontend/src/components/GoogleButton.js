import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { login, logout } from './GoogleStore';

const clientID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';
const authURI = 'http://logan-backend-dev.us-west-2.elasticbeanstalk.com/auth/verify';

class GoogleBtn extends React.Component {
    constructor(props) {
        super(props);

        this.onLogin = this.onLogin.bind(this);
    }

    async onLogin(response) {
        let login = this.props.login;
        axios
            .post(authURI, { idToken: response.tokenId })
            .then((res) => {
                console.log(res);
                console.log('successful');
                login();
            })
            .catch((error) => {
                console.log(error);
                console.log('errored out');
            });
    }

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

const mapStateToProps = (state) => ({
    isLoggedIn: state.isLoggedIn,
});

const mapDispatchToProps = {
    login,
    logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoogleBtn);
