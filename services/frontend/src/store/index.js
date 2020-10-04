import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { devToolsEnhancer } from 'redux-devtools-extension';

const rootReducer = combineReducers({});

const store = configureStore({
    reducer: rootReducer,
    devTools: [devToolsEnhancer()],
});

export default store;
