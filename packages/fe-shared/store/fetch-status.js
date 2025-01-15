import { createSlice } from '@reduxjs/toolkit';
import { dateUtils } from 'packages/core';

const slice = createSlice({
    name: 'fetchStatus',
    initialState: {
        fetching: false,
        lastFetch: undefined,
    },
    reducers: {
        beginFetching(state) {
            state.fetching = true;
        },
        finishFetching(state) {
            state.fetching = false;
            state.lastFetch = dateUtils.formatAsDateTime();
        },
    },
});

export const { beginFetching, finishFetching } = slice.actions;
export default slice.reducer;
