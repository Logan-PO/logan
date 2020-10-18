import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { createAsyncSlice } from '../../utils/redux-utils';
import api from '../../utils/api'

/*
 * A login action
 * Takes in a response, which should be from the google button
 * The response should contain relevant keys and stuff for OAuth
 */
export function login() {
    return { type: 'login' };
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

const { slice, asyncActions } = createAsyncSlice({
    name: 'login',
    initialState: { isLoggedIn: false },
    asyncReducers: {
        fn: api.verifyIDToken,
        success: (state, action) => {} //action.payload is where response is
    },
});
