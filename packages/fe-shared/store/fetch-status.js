import { createSlice } from '@reduxjs/toolkit';
import { dateUtils } from '@logan/core';

const slice = createSlice({
    name: 'fetchStatus',
    initialState: {
        fetching: false,
        lastFetch: undefined,
        blocked: false,
    },
    reducers: {
        blockFetch(state) {
            state.blocked = true;
        },
        unblockFetch(state) {
            state.blocked = false;
        },
        beginFetching(state) {
            state.fetching = true;
        },
        finishFetching(state) {
            state.fetching = false;
            state.lastFetch = dateUtils.formatAsDateTime();
        },
    },
});

export const { blockFetch, unblockFetch, beginFetching, finishFetching } = slice.actions;
export default slice.reducer;
