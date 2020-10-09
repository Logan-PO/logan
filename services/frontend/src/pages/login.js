import React from 'react';
import { Provider } from 'react-redux';
import GoogleBtn from '../components/GoogleButton';
import { googleStore } from '../components/GoogleStore';

export default function Login() {
    return (
        <div>
            <div>
                <h1>Welcome to Logan!</h1>
            </div>
            <Provider store={googleStore}>
                {' '}
                <GoogleBtn />{' '}
            </Provider>
            <div>
                <h1>About Logan</h1>
                <p>Stuff about Logan goes here.</p>
            </div>
        </div>
    );
}
