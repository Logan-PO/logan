import React from 'react';
//import { Provider } from 'react-redux';
import GoogleBtn from '../components/login/GoogleButton';
//import { googleStore } from '../components/login/GoogleStore';

export default function Login() {
    return (
        <div>
            <div>
                <h1>Welcome to Logan!</h1>
            </div>
            <GoogleBtn />{' '}
            <div>
                <h1>About Logan</h1>
                <p>Stuff about Logan goes here.</p>
            </div>
        </div>
    );
}
