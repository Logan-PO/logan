import React from 'react';
import { Provider } from 'react-redux';
import store from './index';

function wrapper({ element }) {
    return <Provider store={store}>{element}</Provider>;
}

export default wrapper;
