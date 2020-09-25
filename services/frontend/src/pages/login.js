import React from 'react';
import { Provider } from 'react-redux';
import GoogleBtn from '../components/GoogleButton';
import { googleStore } from '../components/GoogleStore';

export default function Home() {
    return (
        <Provider store={googleStore}>
            {' '}
            <GoogleBtn />{' '}
        </Provider>
    );
}
