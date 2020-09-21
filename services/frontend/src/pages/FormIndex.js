import React from 'react';
import { Provider } from 'react-redux';
import {store} from './index'
import FormContainer from '../components/fieldForm/form.container';
import {Link} from "gatsby";
import Container from "../components/containter";

export default function Form() {
    const test = 'w'
    return(
        <div>
            <Container>
                <Provider store={store}>
                    <FormContainer />
                    <Link to={'/assignments'}>Cancel</Link>
                </Provider>
            </Container>
        </div>
    )
}
