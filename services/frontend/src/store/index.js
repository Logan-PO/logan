import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from 'redux-devtools-extension';
import login from './login';
import tasks from './tasks';
import assignments from './assignments';
import schedule from './schedule';
import reminders from './reminders';

const rootReducer = combineReducers({
    tasks,
    assignments,
    login,
    schedule,
    reminders,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: [devToolsEnhancer()],
});

export default store;
