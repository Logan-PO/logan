import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { login, logout } from './GoogleStore';

const clientID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';

class GoogleBtn extends React.Component {
    render() {
        let { isLoggedIn, login, logout } = this.props;
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
                        onSuccess={login}
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
