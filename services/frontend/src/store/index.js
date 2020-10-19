import { combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { configureStore } from '@reduxjs/toolkit';
import tasks from './tasks';
import assignments from './assignments';

const rootReducer = combineReducers({
    tasks,
    assignments,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: [devToolsEnhancer(undefined)],
});

export default store;
