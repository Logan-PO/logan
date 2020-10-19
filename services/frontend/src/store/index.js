import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from 'redux-devtools-extension';
import login from './login';
import tasks from './tasks';
import assignments from './assignments';

const rootReducer = combineReducers({
    tasks,
    assignments,
    login,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: [devToolsEnhancer(undefined)],
});

export default store;
