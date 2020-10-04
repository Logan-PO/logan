import _ from 'lodash';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * The configuration for an async reducer
 * @typedef {Object} AsyncReducerConfig
 * @property {function} fn - The body of the async thunk
 * @property {function} [begin] - Called when execution begins
 * @property {function} [success] - Called if the promise resolves
 * @property {function} [failure] - Called if the promise rejects
 */

/**
 * @param {Object} config
 * @param {string} config.name
 * @param config.initialState
 * @param {Object} [config.reducers]
 * @param {Object} [config.extraReducers]
 * @param {Object.<string, AsyncReducerConfig>} [config.asyncReducers]
 */
export default function createAsyncSlice(config) {
    // Create any thunks necesssary
    const asyncReducers = {};
    if (config.asyncReducers) {
        for (const [name, { fn, ...handlers }] of _.entries(config.asyncReducers)) {
            asyncReducers[name] = {
                thunk: createAsyncThunk(`${config.name}/${name}`, fn),
                handlers,
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
    for (const { thunk, handlers } of _.values(asyncReducers)) {
        if (handlers.begin) sliceParams.extraReducers[thunk.pending] = handlers.begin;
        if (handlers.success) sliceParams.extraReducers[thunk.fulfilled] = handlers.success;
        if (handlers.failure) sliceParams.extraReducers[thunk.rejected] = handlers.failure;
    }

    return {
        slice: createSlice(sliceParams),
        asyncActions: _.mapValues(asyncReducers, 'thunk'),
    };
}
