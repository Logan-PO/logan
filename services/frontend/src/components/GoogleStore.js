export const login = (state = { isLoggedIn: false }, action) => {
    switch (action.type) {
        case 'login':
            return { isLoggedIn: true };
        default:
            return state;
    }
};

export const logout = (state = { isLoggedIn: false }, action) => {
    switch (action.type) {
        case 'logout':
            return { isLoggedIn: false };
        default:
            return state;
    }
};
