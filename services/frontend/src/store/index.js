import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from 'redux-devtools-extension';
import tasks from './tasks';
import assignments from './assignments';

const rootReducer = combineReducers({
    tasks,
    assignments,
});

const store = configureStore({
    reducer: rootReducer,
    devTools: [devToolsEnhancer()],
});

export default store;
