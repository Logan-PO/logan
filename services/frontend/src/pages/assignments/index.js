import React from "react"
import {Provider} from 'react-redux'
import {Link, navigate} from "gatsby"
import Container from "../../components/containter"
import {AssignmentFormLocal, gotoAssignmentsForm, HomePageLocal} from "../index";
import {store} from "../../components/AssignmentsPageComponents/store";
import AssignmentCatalog from "../../components/AssignmentsPageComponents/AssignmentCatalog";
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
    //get all assignment days and parse them
    //TODO: pull the color for a given assignment from its class color (classes should have color)
    return (
        <div>
            <Container>
                <h1>Assignments</h1>
                <div><Link to= {HomePageLocal}>Back to Overview</Link></div>
                <AssignmentCatalog/>
                <button style={{backgroundColor:'grey'}} onClick={() => gotoAssignmentsForm()}>
                    Add Assignment
                </button>
            </Container>
            <div><Link to={AssignmentFormLocal}>Form</Link></div>
        </div>
    )//The color will be stored in the course so the color would be pulled from course ID
    //Put assignment under its due date
}
