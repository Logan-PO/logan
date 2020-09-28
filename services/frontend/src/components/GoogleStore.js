import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import axios from 'axios';

const authURI = 'http://logan-backend-dev.us-west-2.elasticbeanstalk.com/auth/verify';

/*
 * A login action
 * Takes in a response, which should be from the google button
 * The response should contain relevant keys and stuff for OAuth
 */
export function login(response) {
    //console.log(response.hasOwnProperty('tokenId'));
    let newType = 'do nothing';
    axios
        .post(authURI, { idToken: response.tokenId })
        .then((res) => {
            newType = 'login';
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        });
    return { type: newType };
}

/*
 * A logout action
 * Takes in a response, which should come from the google button
 */
export function logout(response) {
    console.log(response);
    return { type: 'logout' };
}

/*
 * A reducer for logging in and out
 * Takes in a state (as all reducers should); Default logged out
 * The action should have a type field specifying if we want to log in our out
 */
export const loginReducer = (state = { isLoggedIn: false }, action) => {
    switch (action.type) {
        case 'login':
            return { isLoggedIn: true };
        case 'logout':
            return { isLoggedIn: false };
        default:
            return state;
    }
};

//Creating the store
export const googleStore = createStore(loginReducer, devToolsEnhancer(undefined));
