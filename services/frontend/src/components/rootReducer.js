import assignmentReducer from "./assignment";
import assignmentDayReducer from "./assignmentDay";
import {combineReducers} from "redux";

/**
 * This file is used to hold and maintain the root reducer that is used to define the state
 * @type {Reducer<CombinedState<{assignmentDay: {list: *[], day: string}, assignment: ({color: *, name: *, id: *, class: *, desc: *}|{color: string, name: string, id: number, class: string, desc: string})}>>}
 */
const rootReducer = combineReducers({
    assignment: assignmentReducer,
    assignmentDay: assignmentDayReducer
});
export default rootReducer
