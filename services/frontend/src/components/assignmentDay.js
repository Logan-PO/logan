import React from "react"
/**
 * This file was made for managing redux logic needed to add an assignment day to the state
 */

/**
 * A reducer for adding and removing assignments from this assignment day
 *
 * @param state the current global state of the program
 * @param action the inputted attributes to be added to this assignment day
 * @returns {{list: [], day: string}}
 */
let myState = { list:[{id: 1, name: 'Lab', color: 'red', class: 'CSDS 100', desc: "TBD"}]}

/**
 * A reducer for adding and removing assignments from a given assignment day
 *
 * @param state
 * @param action
 * @returns {{list: [], day: string}}
 */
const assignmentDayReducer = (state = {list: [] , day: 'M0nday'},action) => {
    const tempAssignmentList = state.list
    switch (action.type){
        case 'addAssignment':
            const newAssignment = {id: action.id, name: action.name, color: action.color, class: action.class, desc: action.desc,due: action.due}
            tempAssignmentList.push(newAssignment)
            return {list: tempAssignmentList, day: state.day}
        case 'deleteAssignment':
            for (let i = 0; i < tempAssignmentList.length; i++){
                if (tempAssignmentList[i].id == action.assignment.id){
                    tempAssignmentList.splice(i,1)
                }
            }
            return {list: tempAssignmentList, day: state.day}
        default:
            return  state
    }
}



//Exporting the reducer so that it can be added to the root reducer (rootReducer.js)
export default assignmentDayReducer

//Exporting the current list of assignments to be displayed by the assignments page


