import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
/**
 *The store to be used globally by the frontend
 */

//You should use createSlice from redux-toolkit to create you actions and reducers so that it will be uniform throughout the source code
export const store = createStore(
    combineReducers({
        /*This is where you will put your reducer functions from your separate reducer files*/
    }),
    //Required line of text so that you can use the browser dev tools
    devToolsEnhancer(undefined)
);
