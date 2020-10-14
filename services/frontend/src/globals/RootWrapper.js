import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import store from '../store';
import theme from './theme';

function wrapper({ element }) {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <CssBaseline />
                {element}
            </Provider>
        </ThemeProvider>
    );
}

export default wrapper;
