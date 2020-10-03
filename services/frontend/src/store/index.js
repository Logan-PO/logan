import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

const rootReducer = combineReducers({});

export default () => createStore(rootReducer, devToolsEnhancer());
