import React from "react"
import  {createSlice} from "@reduxjs/toolkit";

/**
 * Redux logic goes in this file
 * @type {{list: [{color: string, name: string, id: number, class: string, desc: string}]}}
 */
let state = { list:[{id: 1, name: 'Lab', color: 'red', class: 'CSDS 100', desc: "TBD"}]}

/**
 * A reducer for adding and removing assignments from a given assignment day
 *
 * @param state
 * @param action
 * @returns {{list: [], day: string}}
 */
const assignmentDayReducer = (state = {list: [] , day: ''},action) => {
    const tempAssignmentList = state.list
    switch (action.type){
        case 'addAssignment':
            tempAssignmentList.push(action.assignment)
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



export default assignmentDayReducer


export const items = state.list.map((item) =>
    <li key={item.id}>
        <h3 style={{backgroundColor:item.color}}>{item.class} </h3>
        <div>Assignment: {item.name} <div>Desc: {item.desc}</div> </div>
    </li>
);

