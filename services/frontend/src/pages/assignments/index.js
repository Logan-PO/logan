import React from "react"
import {Provider, useDispatch, useSelector} from 'react-redux'
import {Link, navigate} from "gatsby"
import Container from "../../components/containter"
import {addAssignment, deleteAssignment} from "../../components/AssignmentsPageComponents/AssignmentsPageActions";
import {AssignmentFormLocal, gotoAssignmentsForm, store,HomePageLocal} from "../index";
import {formatAssignmentsForView} from "../../components/AssignmentsPageComponents/AssignmentListFormat";
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

export let dispatch = []
/**
 * A function that displays the assignment page
 * @returns {JSX.Element}
 * @constructor
 */
function DisplayAssignments() {
    const assignment = useSelector(state => state.assignment)
    const assignmentDay = useSelector(state => state.assignmentDay)
    dispatch =  useDispatch();


//TODO:extract
    let itemsOfGivenDay = formatAssignmentsForView(assignmentDay)


    //get all assignment days and parse them
    //TODO: pull the color for a given assignment from its class color (classes should have color)
    return (
        <div>
            <Container>
                <h1>Assignments</h1>
                <ul>{itemsOfGivenDay} </ul>
                <div><Link to= {HomePageLocal}>Back to Overview</Link></div>

                <button style={{backgroundColor:'grey'}} onClick={() => gotoAssignmentsForm()}>
                    Add Assignment
                </button>
            </Container>
            <div><Link to={AssignmentFormLocal}>Form</Link></div>
        </div>
    )//The color will be stored in the course so the color would be pulled from course ID
    //Put assignment under its due date
}
