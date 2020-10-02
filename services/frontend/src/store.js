import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form';
import {
    assignmentCatalogReducer,
    editShownReducer,
    shownReducer,
} from './components/AssignmentsPageComponents/AssignmentReducers';
/**
 *The assignmentReducers to be used globally by the frontend
 */

//You should use createSlice from redux-toolkit to create you actions and reducers so that it will be uniform throughout the source code
export const store = createStore(
    combineReducers({
        /*This is where you will put your reducer functions from your separate reducer files*/
        AssignmentCatalog: assignmentCatalogReducer, //represents the assignment catalog in the assignmentReducers
        form: formReducer, //represents the form values in the assignmentReducers
        isFormShown: shownReducer, //keeps tack of whether or not the addAssignment form is being shown
        isEditFormShown: editShownReducer, //keeps tack of whether or not the editAssignment form is being shown
    }),
    //Required line of text so that you can use the browser dev tools
    devToolsEnhancer(undefined)
);
