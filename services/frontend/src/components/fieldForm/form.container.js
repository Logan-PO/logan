import React from 'react';
import { reduxForm } from 'redux-form';
import FormComponent from './form.component';
import {Provider, useDispatch} from "react-redux";
import {addAssignment} from "../assignmentsActions";
import {store} from "../../pages";
import {dispatch} from "../../pages/assignments";
import { navigate} from "gatsby"

/**
 * Uses form component
 * @param handleSubmit
 * @returns {JSX.Element}
 * @constructor
 */
export const FormContainer = ({ handleSubmit }) => {

    const submitForm = (formValues) => {
        dispatch(addAssignment(formValues))
        console.log('submitting Form: ', formValues);
        navigate('/assignments/')
    }
    return (
        <Provider store={store}>
        <FormComponent
            onSubmit={submitForm}
            handleSubmit={handleSubmit}
        />
        </Provider>
    );
}
const formConfiguration = {
    form: 'my-very-own-form'
}
export default reduxForm(formConfiguration)(FormContainer);
