import { createStore } from 'redux';

//A login action
export const login = () => ({ type: 'login' });
//A logout action
export const logout = () => ({ type: 'logout' });

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
export const googleStore = createStore(loginReducer);
