import React from 'react';
import {Provider, useDispatch} from 'react-redux';
import {AssignmentsPageLocal, gotoAssignments} from '../index'
import {Link} from "gatsby";
import Container from "../../components/containter";
import {addAssignment, store} from '../../components/AssignmentsPageComponents/store'
import AssignmentForm from "../../components/AssignmentsPageComponents/AssignmentForm";

export let newFormValues

export default function wrapper(){
    return(
        <Provider store={store}>
            <Form/>
        </Provider>
    )
}
function Form() {
    let dispatch = useDispatch()

    return(
        <div>
            <Container>
                <AssignmentForm onSubmit = {(formValues) => {
                    newFormValues = formValues
                    dispatch(addAssignment(formValues))
                    gotoAssignments()
                }}/>
                <Link to={AssignmentsPageLocal}>Cancel</Link>
            </Container>
        </div>
    )
}
