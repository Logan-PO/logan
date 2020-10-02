import React from 'react';
import { Provider } from 'react-redux';
import GoogleBtn from '../components/GoogleButton';
import { googleStore } from '../components/GoogleStore';

export default function Login() {
    return (
        <div>
            <div>
                <h1>Login</h1>
            </div>
            <Provider store={googleStore}>
                {' '}
                <GoogleBtn />{' '}
            </Provider>
        </div>
    );
}
