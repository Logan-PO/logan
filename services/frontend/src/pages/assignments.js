import React from 'react';
import AssignmentPage from '../components/AssignmentsPageComponents/assignments-page';
/**
 * The React component that shows the UI for the assignments feature
 * @type {({color: string, name: string, id: number, class: string, desc: string}|{color: string, name: string, id: number, class: string, desc: string}|{color: string, name: string, id: number, class: string, desc: string})[]}
 */

/**
 * A wrapper function used to give the assignments page a state and and give it access to said state
 * @returns {JSX.Element}
 */

export default function wrapper() {
    return <AssignmentPage />;
}
