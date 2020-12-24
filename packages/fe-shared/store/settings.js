import { createAsyncSlice } from '../utils/redux-utils';
import api from '../utils/api';

const { slice, asyncActions } = createAsyncSlice({
    name: 'settings',
    initialState: {
        primary: 'teal',
        accent: 'deepOrange',
    },
    reducers: {
        selectPrimaryColor(state, action) {
            state.primary = action.payload;
        },
        selectAccentColor(state, action) {
            state.accent = action.payload;
        },
    },
    asyncReducers: {
        updateUser: {
            fn: api.updateUser,
            success(state, action) {
                state.user = action.payload;
            },
        },
        deleteUser: {
            fn: api.deleteUser,
        },
    },
});

export const { selectPrimaryColor, selectAccentColor } = slice.actions;
export const { updateUser, deleteUser } = asyncActions;
export { asyncActions };
export default slice.reducer;
