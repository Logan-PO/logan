import React from 'react';
import { Provider } from 'react-redux';
import {AssignmentsPageLocal, store} from './index'
import FormContainer from '../components/AssignmentsPageComponents/assignment.form.container';
import {Link} from "gatsby";
import Container from "../components/containter";

export default function Form() {
    const test = 'w'
    return(
        <div>
            <Container>
                <Provider store={store}>
                    <FormContainer />
                    <Link to={AssignmentsPageLocal}>Cancel</Link>
                </Provider>
            </Container>
        </div>
    )
}
