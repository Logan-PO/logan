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
export function logout() {
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
