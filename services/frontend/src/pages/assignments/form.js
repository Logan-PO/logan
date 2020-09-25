import React from 'react';
import {Provider} from 'react-redux';
import {AssignmentsPageLocal, gotoAssignments} from '../index'
import {Link} from "gatsby";
import Container from "../../components/containter";
import {addAssignment, store} from '../../components/AssignmentsPageComponents/store'
import AssignmentForm from "../../components/AssignmentsPageComponents/AssignmentForm";


export default function Form() {



    return(
        <div>
            <Provider store={store}>
                <Container>
                    <AssignmentForm onSubmit = {(formValues) => {
                        addAssignment(formValues)
                        gotoAssignments()
                    }}/>
                    <Link to={AssignmentsPageLocal}>Cancel</Link>
                </Container>
            </Provider>
        </div>
    )
}
