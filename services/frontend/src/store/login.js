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
            const newStage = action.payload;
            state.currentStage = newStage;

            state.isLoggedIn = newStage !== LOGIN_STAGE.LOGIN;
            state.isUserConnected = newStage === LOGIN_STAGE.LOGGED_IN || newStage === LOGIN_STAGE.DONE;

            if (newStage !== LOGIN_STAGE.CREATE) state.userMeta = undefined;
            if (newStage === LOGIN_STAGE.LOGIN) state.user = undefined;
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
        createNewUser: {
            fn: api.createNewUser,
            success(state, action) {
                const response = action.payload;
                api.setBearerToken(response.token);
                state.currentStage = LOGIN_STAGE.LOGGED_IN;
            },
        },
    },
});

export { LOGIN_STAGE };
export const { setLoginStage } = slice.actions;
export const { verifyIdToken, createNewUser } = asyncActions;
export { asyncActions };
export default slice.reducer;
