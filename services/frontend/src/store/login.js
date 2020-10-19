import { createAsyncSlice } from '../utils/redux-utils';
import api from '../utils/api';

const { slice, asyncActions } = createAsyncSlice({
    name: 'login',
    initialState: {
        currentStage: 'login',
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
});

export const { login, logout } = slice.actions;
export default slice.reducer;
