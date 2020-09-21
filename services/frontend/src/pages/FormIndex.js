import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import "tachyons"

import FormContainer from '../components/fieldForm/form.container';
import configureStore from '../components/fieldForm/store';
import Container from "../components/containter";
import {Link} from "gatsby";

const store = configureStore();

export default function Form() {
    return(
        <div>
            <Provider store={store}>
                <FormContainer />
                <Link to={'/assignments'}>Cancel</Link>
            </Provider>
        </div>
    )
}
