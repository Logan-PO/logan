import React from "react"
import  {createSlice} from "@reduxjs/toolkit";
const assignmentsList = [
    {id: 35, name: 'Lab', color: 'red', class: 'PHSY 101', desc: "sad"},
    {id: 42, name: 'Project', color: 'blue', class: 'EECS 293', desc: "happy"},
    {id: 71, name: 'Grading', color: 'green', class: 'all', desc: "?"},
]

export const assignmentDaySlice = createSlice({
    name: 'assignment',
    initialState: {
        id:0,
        name:'Empty',
        color:'grey',
        class:'CSDS 000',
        desc: 'empty'
    },
    reducers: {
        addAssignment: (state,action) => {
            state.assignments = state.assignments.add(action.payload)
        },
        deleteAssignment: (state,action) => {
            state.assignments = state.assignments.remove(action.payload)
        }
    }
})
export const items = assignmentsList.map((item) =>
    <li key={item.id}>
        <h3 style={{backgroundColor:item.color}}>{item.class} </h3>
        <div>Assignment: {item.name} <div>Desc: {item.desc}</div> </div>
    </li>
);


export default function AssignmentDaySlice({ props }) {
    return <div>{props.day} <button>edit assignment</button></div>
}
