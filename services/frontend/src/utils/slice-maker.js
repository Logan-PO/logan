import _ from 'lodash';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * The configuration for an async reducer
 * @typedef {Object} AsyncReducerConfig
 * @property {function} fn - The body of the async thunk. This is what actually gets converted into the thunk
 * @property {function} [begin] - Called when execution begins. This gets converted to an extraReducer
 * @property {function} [success] - Called if the promise resolves. This gets converted to an extraReducer
 * @property {function} [failure] - Called if the promise rejects. This gets converted to an extraReducer
 */

/**
 * This function simplifies the use of createSlice and createAsyncThunk by allowing you to create everything in one
 * method call. Using the asyncReducers property, this function will automatically create async thunks for you, and
 * create extraReducer handlers for them. See the above documentation for how to pass asyncReducers in
 * @param {Object} config
 * @param {string} config.name
 * @param config.initialState
 * @param {Object} [config.reducers]
 * @param {Object} [config.extraReducers]
 * @param {Object.<string, AsyncReducerConfig>} [config.asyncReducers]
 */
export default function createAsyncSlice(config) {
    const asyncReducers = {};

    // Create any async thunks necessary, and store their extraReducer handler for later
    if (config.asyncReducers) {
        for (const [name, { fn, ...handlers }] of _.entries(config.asyncReducers)) {
            asyncReducers[name] = {
                thunk: createAsyncThunk(`${config.name}/${name}`, fn),
                handlers,
            };
        }
    }

    const sliceConfig = {
        name: config.name,
        initialState: config.initialState,
        reducers: config.reducers,
        extraReducers: config.extraReducers,
    };

    // Set up thunk handlers as extraReducers
    for (const { thunk, handlers } of _.values(asyncReducers)) {
        if (handlers.begin) _.set(sliceConfig, ['extraReducers', thunk.pending], handlers.begin);
        if (handlers.success) _.set(sliceConfig, ['extraReducers', thunk.fulfilled], handlers.success);
        if (handlers.failure) _.set(sliceConfig, ['extraReducers', thunk.rejected], handlers.failure);
    }

    // Return asyncActions as its own property for easy exporting later
    return {
        slice: createSlice(sliceConfig),
        asyncActions: _.mapValues(asyncReducers, 'thunk'),
    };
}
