import { createEntityAdapter } from '@reduxjs/toolkit';
import { createAsyncSlice } from '../utils/redux-utils';
import api from '../utils/api';

const adapter = createEntityAdapter({
    selectId: user => user.uid,
});

const { slice, asyncActions } = createAsyncSlice({
    name: 'settings',
    initialState: adapter.getInitialState(),
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

export const { updateUser, deleteUser } = asyncActions;
export { asyncActions };
export default slice.reducer;
