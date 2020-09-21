import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import assignmentReducer from "../assignment";
import assignmentDayReducer from "../assignmentDay";

export default function createReducer(extraReducerObjects = {}) {
    return combineReducers({
        form: formReducer,
        assignment: assignmentReducer,
        assignmentDay: assignmentDayReducer,
        ...extraReducerObjects
    });
}
