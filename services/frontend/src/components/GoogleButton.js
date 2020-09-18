import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const clientID = '850674143860-haau84mtom7b06uqqhg4ei1jironoah3.apps.googleusercontent.com';

class GoogleBtn extends React.Component {
    constructor(props) {
        super(props);
        //Setting up state components
        this.state = {
            isLoggedIn: false,
            accessToken: '',
        };
        //Binding methods
        this.login = this.login.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLogoutFalure = this.handleLogoutFailure.bind(this);
    }

    //On login, if there is an access token, update state appropriately
    login(response) {
        if (response.accessToken) {
            this.setState(() => ({
                isLoggedIn: true,
                accessToken: response.accessToken,
            }));
        }
    }

    //Changing state to not logged in on logout
    logout() {
        this.setState(() => ({
            isLoggedIn: false,
            accessToken: '',
        }));
    }

    //If we fail to log in, print the response
    handleLoginFailure(response) {
        console.log(response);
    }

    //If we fail to log out, print the response
    handleLogoutFailure(response) {
        console.log(response);
    }

    render() {
        return (
            <div>
                {this.state.isLoggedIn ? (
                    //Logout button and fields
                    <GoogleLogout
                        clientId={clientID}
                        buttonText="Logout"
                        onLogoutSuccess={this.logout}
                        onFailure={this.handleLogoutFailure}
                    ></GoogleLogout>
                ) : (
                    //Login button and fields
                    <GoogleLogin
                        clientId={clientID}
                        buttonText="Login"
                        onSuccess={this.login}
                        onFailure={this.handleLoginFailure}
                        cookiePolicy={'single_host_origin'}
                        responseType="code,token"
                    ></GoogleLogin>
                )}
                {/* Showing the access token on the page, take out in final commit */}
                {this.state.accessToken ? (
                    <h5>
                        Your Access Token: <br />
                        <br /> {this.state.accessToken}
                    </h5>
                ) : null}
            </div>
        );
    }
}

//Exporting the button to be rendered
export default GoogleBtn;
