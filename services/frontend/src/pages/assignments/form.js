import React from 'react';
import { Provider } from 'react-redux';
import {AssignmentsPageLocal} from '../index'
import {Link} from "gatsby";
import Container from "../../components/containter";
import {store} from '../../components/AssignmentsPageComponents/store'
import AssignmentForm from "../../components/AssignmentsPageComponents/AssignmentForm";

export default function Form() {
    return(
        <div>
            <Container>
                <Provider store={store}>
                    <Link to={AssignmentsPageLocal}>Cancel</Link>
                </Provider>
            </Container>
        </div>
    )
}
