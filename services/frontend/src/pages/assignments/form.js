import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { AssignmentsPageLocal, gotoAssignments } from '../index';
import { Link } from 'gatsby';
import Container from '../../components/containter';
import { addAssignment, store } from '../../components/AssignmentsPageComponents/store';
import AssignmentForm from '../../components/AssignmentsPageComponents/AssignmentForm';

export default function Wrapper() {
    return (
        <Provider store={store}>
            <Form />
        </Provider>
    );
}
function Form() {
    let dispatch = useDispatch();
    const submitForm = (formValues) => {
        dispatch(addAssignment(formValues));
        console.log('submitting Form: ', formValues);
        gotoAssignments();
    };

    return (
        <div>
            <Container>
                <AssignmentForm onSubmit={submitForm} />
                <Link to={AssignmentsPageLocal}>Cancel</Link>
            </Container>
        </div>
    );
}
