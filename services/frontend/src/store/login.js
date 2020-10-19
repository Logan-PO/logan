import { createAsyncSlice } from '../utils/redux-utils';
import api from '../utils/api';

const LOGIN_STAGE = {
    LOGIN: 'login',
    CREATE: 'create',
    LOGGED_IN: 'logged_in',
    DONE: 'done',
};

function getInitialState() {
    const hasStashedBearer = api.hasStashedBearer();

    return {
        currentStage: hasStashedBearer ? LOGIN_STAGE.DONE : LOGIN_STAGE.LOGIN,
        isLoggedIn: hasStashedBearer,
        isUserConnected: hasStashedBearer,
        user: undefined,
        userMeta: undefined,
    };
}

const { slice, asyncActions } = createAsyncSlice({
    name: 'login',
    initialState: getInitialState(),
    reducers: {
        setLoginStage(state, action) {
            const newStage = action.payload;
            state.currentStage = newStage;

            state.isLoggedIn = newStage !== LOGIN_STAGE.LOGIN;
            state.isUserConnected = newStage === LOGIN_STAGE.LOGGED_IN || newStage === LOGIN_STAGE.DONE;

            if (newStage !== LOGIN_STAGE.CREATE) {
                state.userMeta = undefined;
            }

            if (newStage === LOGIN_STAGE.LOGIN) {
                state.user = undefined;
                api.setBearerToken(undefined);
            }
        },
    },
    asyncReducers: {
        verifyIdToken: {
            fn: api.verifyIDToken,
            success(state, action) {
                const response = action.payload;

                api.setBearerToken(response.token, response.exists);

                if (response.exists) {
                    state.currentStage = LOGIN_STAGE.LOGGED_IN;
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
        fetchSelf: {
            fn: async () => api.getUser('me'),
            success(state, action) {
                state.user = action.payload;
            },
        },
    },
});

export { LOGIN_STAGE };
export const { setLoginStage } = slice.actions;
export const { verifyIdToken, createNewUser, fetchSelf } = asyncActions;
export { asyncActions };
export default slice.reducer;
