import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import "tachyons"
import store from './index'
import FormContainer from '../components/fieldForm/form.container';
import configureStore from '../components/fieldForm/store';
import {Link} from "gatsby";

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
