import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import tasks from './tasks';

const rootReducer = combineReducers({
    tasks,
});

export default () => createStore(rootReducer, devToolsEnhancer(undefined));
