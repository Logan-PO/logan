import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { loginReducer } from '../components/login/GoogleStore';
import tasks from './tasks';

const rootReducer = combineReducers({
    tasks,
    loginReducer,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: [devToolsEnhancer(undefined)],
});

export default store;
