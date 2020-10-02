import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store';
import AssignmentCatalog from '../../components/AssignmentsPageComponents/AssignmentCatalog';
/**
 * The React component that shows the UI for the assignments feature
 * @type {({color: string, name: string, id: number, class: string, desc: string}|{color: string, name: string, id: number, class: string, desc: string}|{color: string, name: string, id: number, class: string, desc: string})[]}
 */

/**
 * A wrapper function used to give the assignments page a state and and give it access to said state
 * @returns {JSX.Element}
 */

export default function wrapper() {
    //TODO: This is the current assignmentReducers being used for the assignments page as the attributes of this assignmentReducers cannot be generalized

    return (
        <Provider store={store}>
            <AssignmentCatalog />
        </Provider>
    );
}
