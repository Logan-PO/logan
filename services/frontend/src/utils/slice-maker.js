import _ from 'lodash';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 *
 * @param config
 * @param config.name - The slice name
 * @param config.initialState
 * @param [config.reducers]
 * @param [config.extraReducers]
 * @param [config.asyncReducers]
 */
export default function createAsyncSlice(config) {
    // Create any thunks necesssary
    const asyncReducers = {};
    if (config.asyncReducers) {
        for (const [name, { fn, handler }] of _.entries(config.asyncReducers)) {
            asyncReducers[name] = {
                thunk: createAsyncThunk(`${config.name}/${name}`, fn),
                handler,
            };
        }
    }

    const sliceParams = {
        name: config.name,
        initialState: config.initialState,
        reducers: config.reducers || {},
        extraReducers: config.extraReducers || {},
    };

    // Set up their handlers as extraReducers
    for (const { thunk, handler } of _.values(asyncReducers)) {
        sliceParams.extraReducers[thunk.fulfilled] = handler;
    }

    return {
        slice: createSlice(sliceParams),
        asyncActions: _.mapValues(asyncReducers, 'thunk'),
    };
}
