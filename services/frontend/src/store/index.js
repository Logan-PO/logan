import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { loginReducer } from './login-reducers';
import tasks from './tasks';
import schedule from './schedule';

const rootReducer = combineReducers({
    tasks,
    loginReducer,
    schedule,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: [devToolsEnhancer()],
});

export default store;
