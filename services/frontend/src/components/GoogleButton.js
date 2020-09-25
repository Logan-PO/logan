import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { connect } from 'react-redux';
import { login, logout } from './GoogleStore';

const clientID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';

function GoogleBtn({ isLoggedIn, login, logout }) {
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
                    responseType="code,token"
                >
                    {}
                </GoogleLogin>
            )}
        </div>
    );
}

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
