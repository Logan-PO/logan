import React from "react"
import {Provider} from 'react-redux'
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
            <AssignmentCatalog />
        </Provider>
    )
}

/**
 * A function that displays the assignment page
 * @returns {JSX.Element}
 * @constructor
 */

