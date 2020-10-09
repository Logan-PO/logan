import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import store from '.';

function wrapper({ element }) {
    return (
        <Provider store={store}>
            <CssBaseline />
            {element}
        </Provider>
    );
}

export default wrapper;
