import {createStore, compose, combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';
import {AssignmentCatalog} from "./AssignmentCatalog";

const composeEnhancers =
    typeof window === 'object' &&
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose);
/**
 * ACTIONS
 */
import Assignment from "./Assignment";

/**
 * This file is used to define all of the possible actions able to be taken within the assignments page
 */

/**
 * this is used to define an action that the user can take to add an assignment
 * @returns returns the attributes of the assignment that is to be created {{color: string, name: string, id: number, type: string, class: string, desc: string}}
 */
export const addAssignment = assignmentVals => {
    return{//TODO: the values in this return are temporary and should be filled in via user input through the addAssignmentForm.js
        //The assignment form values will probably be collected via an export from the assignments page
        type: 'addAssignment',
        id: assignmentVals.id,
        name: assignmentVals.name,
        class: assignmentVals.class,
        desc: assignmentVals.desc,
        day: assignmentVals.day,
        color: assignmentVals.color
    };
};

//TODO: This will also take in user input and use the id of the assignment to find and remove it from a given assignment day
export const deleteAssignment = assignment => {
    return{
        type: 'deleteAssignment',
        assignment: assignment
    };
};

//TODO: This will look very similar to add assignment except it will use the existing ID and update the other fields according to user input
export const editAssignment = (assignment,args) => {
    return{
        type: 'editAssignment',
        args: args,
        assignment: assignment
    };
};

/**
 * REDUXERS
 * @param state
 * @param action
 * @returns {{assignmentCatalog: AssignmentCatalog}}
 */
const assignmentCatalogReducer = (state = {
    assignmentCatalog: new AssignmentCatalog({assignmentDayList: [] } ) },action) => {

    const tempAssignmentCatalog = state.assignmentCatalog
    switch (action.type){
        case 'addAssignment':
            const newAssignment = new Assignment({
                id: action.id,
                name: action.name,
                class: action.class,
                desc: action.desc,
                day: action.day,
                color: action.color})
            tempAssignmentCatalog.addAssignment(newAssignment)
            return {assignmentCatalog: tempAssignmentCatalog}
        case 'deleteAssignment':
            tempAssignmentCatalog.deleteAssignment(action.assignment)
            return {assignmentCatalog: tempAssignmentCatalog}
        case 'editAssignment' :
            action.assignment.editAssignment(action.args)
            return {assignmentCatalog: tempAssignmentCatalog}
        default:
            return  state
    }
}

export const store = createStore(
    combineReducers({ AssignmentCatalog : assignmentCatalogReducer, form: formReducer}),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())




