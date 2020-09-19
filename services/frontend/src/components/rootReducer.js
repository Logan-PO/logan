import assignmentReducer from "./assignment";
import assignmentDayReducer from "./assignmentDay";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    assignment: assignmentReducer,
    assignmentDay: assignmentDayReducer
});
export default rootReducer
