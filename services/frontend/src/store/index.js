import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from 'redux-devtools-extension';
import login from './login';
import tasks from './tasks';

const rootReducer = combineReducers({
    tasks,
    login,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: [devToolsEnhancer(undefined)],
});

export default store;
