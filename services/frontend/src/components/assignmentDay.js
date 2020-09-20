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
const assignmentDayReducer = (state = {list: [] , day: ''},action) => {
    const tempAssignmentList = state.list
    switch (action.type){
        case 'addAssignment':
            tempAssignmentList.push({id: action.id, name: action.name, color: action.color, class: action.class, desc: action.desc})
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
export const items = myState.list.map((item) =>
    <li key={item.id}>
        <h3 style={{backgroundColor:item.color}}>{item.class} </h3>
        <div>Assignment: {item.name} <div>Desc: {item.desc}</div> </div>
    </li>
);

