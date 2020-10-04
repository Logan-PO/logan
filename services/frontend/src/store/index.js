import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import tasks from './tasks';

const rootReducer = combineReducers({
    tasks,
});

const store = createStore(rootReducer, devToolsEnhancer());

export default store;
