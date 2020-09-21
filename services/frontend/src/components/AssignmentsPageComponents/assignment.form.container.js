import React from 'react';
import { reduxForm } from 'redux-form';
import AssignmentFormComponent from './assignment.form.component';
import {Provider, useDispatch} from "react-redux";
import {addAssignment} from "./AssignmentsPageActions";
import {AssignmentsPageLocal, store} from "../../pages";
import {dispatch} from "../../pages/assignments";
import { navigate} from "gatsby"

/**
 * Uses form component
 * @param handleSubmit
 * @returns {JSX.Element}
 * @constructor
 */
export const AssignmentFormContainer = ({ handleSubmit }) => {

    const submitForm = (formValues) => {
        dispatch(addAssignment(formValues))
        console.log('submitting Form: ', formValues);
        navigate(AssignmentsPageLocal)
    }
    return (
        <Provider store={store}>
        <AssignmentFormComponent
            onSubmit={submitForm}
            handleSubmit={handleSubmit}
        />
        </Provider>
    );
}
const formConfiguration = {
    form: 'my-very-own-form'
}
export default reduxForm(formConfiguration)(AssignmentFormContainer);
