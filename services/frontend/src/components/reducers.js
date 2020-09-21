import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import assignmentReducer from "./AssignmentsPageComponents/AssignmentReducer";
import assignmentDayReducer from "./AssignmentsPageComponents/AssignmentDayReducer";

/**
 * Add extra reducers to add more to the state
 * @param extraReducerObjects
 * @returns {Reducer<CombinedState<unknown>>}
 */
export default function createReducer(extraReducerObjects = {}) {
    return combineReducers({
        form: formReducer,
        assignment: assignmentReducer,
        assignmentDay: assignmentDayReducer,//TODO: Add reducer pipeline for lists of assignment days and organize via due dates
        ...extraReducerObjects
    });
}
