import { createAsyncSlice } from '../utils/redux-utils';
import api from '../utils/api';

const LOGIN_STAGE = {
    LOGIN: 'login',
    CREATE: 'create',
    LOGGED_IN: 'logged_in',
    DONE: 'done',
};

const { slice, asyncActions } = createAsyncSlice({
    name: 'login',
    initialState: {
        currentStage: LOGIN_STAGE.LOGIN,
        isLoggedIn: false,
        isUserConnected: false,
    },
    reducers: {
        setLoginStage(state, action) {
            state.currentStage = action.payload;
        },
        login(state) {
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
        },
    },
    asyncReducers: {
        verifyIdToken: {
            fn: api.verifyIDToken,
            success(state, action) {
                const response = action.payload;

                api.setBearerToken(response.token);

                if (response.exists) {
                    state.currentStage = LOGIN_STAGE.LOGGED_IN;
                    state.user = response.user;
                } else {
                    state.currentStage = LOGIN_STAGE.CREATE;
                    state.userMeta = response.meta;
                }
            },
        },
    },
});

export { LOGIN_STAGE };
export const { setLoginStage, login, logout } = slice.actions;
export const { verifyIdToken } = asyncActions;
export { asyncActions };
export default slice.reducer;
