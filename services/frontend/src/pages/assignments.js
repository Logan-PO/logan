import React from "react"
import {Provider, useDispatch, useSelector} from 'react-redux'
import { Link } from "gatsby"
import Container from "../components/containter"
//import items from "../components/assignmentDay"
import {addAssignment, deleteAssignment} from "../components/assignmentsActions";
import {createStore} from "redux";
import rootReducer from "../components/rootReducer";
import {store} from "./index";
/**
 * The React component that shows the UI for the assignments feature
 * @type {({color: string, name: string, id: number, class: string, desc: string}|{color: string, name: string, id: number, class: string, desc: string}|{color: string, name: string, id: number, class: string, desc: string})[]}
 */

/**
 * A wrapper function used to give the assignments page a state and and give it access to said state
 * @returns {JSX.Element}
 */
export default function  wrapper() {
    //TODO: This is the current store being used for the assignments page as the attributes of this store cannot be generalized

    return (
        <Provider store = {store}>
            <DisplayAssignments />
        </Provider>
    )
}

/**
 * A function that displays the assignment page
 * @returns {JSX.Element}
 * @constructor
 */
function DisplayAssignments() {
    const assignment = useSelector(state => state.assignment)
    const assignmentDay = useSelector(state => state.assignmentDay)
    const dispatch = useDispatch();


    let itemsOfGivenDay = assignmentDay.list.map((item) =>
        <li key={item.id}>
            <h3 style={{backgroundColor:item.color}}>{item.class} </h3>
            <div>Assignment: {item.name} <div>Desc: {item.desc}</div> </div>
        </li>)


    //get all assignment days and parse them
    //TODO: pull the color for a given assignment from its class color (classes should have color)
    return (
        <div>
            <Container>
                <h1>Assignments</h1>
                <ul>{itemsOfGivenDay} </ul>
                <div><Link to="../">Back to Overview</Link></div>
                <button style={{backgroundColor:'grey'}} onClick={() => dispatch(addAssignment())}>
                    Add Assignment
                </button>
                <button style={{backgroundColor:'red'}} onClick={() => dispatch(deleteAssignment())}>
                    Delete Assignment
                </button>
            </Container>
        </div>
    )//The color will be stored in the course so the color would be pulled from course ID
    //Put assignment under its due date
}
