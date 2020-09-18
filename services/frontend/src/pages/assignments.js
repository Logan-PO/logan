import React from "react"
import classColors from "../styles/assignments.css"
import { Link } from "gatsby"
import Container from "../components/containter"
import { configureStore } from '@reduxjs/toolkit'
import items from "../components/assignmentDaySlice"

/**
 * The React component that shows the UI for the assignments feature
 * @type {({color: string, name: string, id: number, class: string, desc: string}|{color: string, name: string, id: number, class: string, desc: string}|{color: string, name: string, id: number, class: string, desc: string})[]}
 */


const allAssignments = {
    type: 'assignments/fetchAssignments',
    payload: 'assignments'
}//state -> view -> actions -> state ...

const addAssignment = text => {
    return {
        type: 'assignments/addAssignment',
        payload: text
    }

}

const initialState = {value: 0}

function assignmentReducer(state = initialState, action){
    if (action.type === 'assignments/addAssignment'){
        return {
            ...state,//return a copy of the state plus
            value: state.value + 1//the new value its storing
        }
    }
    return state
}

const store = configureStore({reducer : assignmentReducer})

console.log(store.getState())

export default function DisplayAssignments() {

    //get all assignment days and parse them

    return ( <div><Container>
            <h1>Assignments</h1>

        <ul>{items}</ul>

            <div><Link to="../">Back to Overview</Link></div>
    </Container> <button style={{backgroundColor:'grey'}} onClick={text => dispatch(addAssignment(text))} >Add Assignment</button> </div>
    )//The color will be stored in the course so the color would be pulled from course ID
    //Put assignment under its due date
}
