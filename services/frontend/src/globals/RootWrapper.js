import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import store from '@logan/fe-shared/store';
import DynamicThemeProvider from './dynamic-theme-provider';

function wrapper({ element }) {
    return (
        <StoreProvider store={store}>
            <DynamicThemeProvider>
                <CssBaseline />
                {element}
            </DynamicThemeProvider>
        </StoreProvider>
    );
}

export default wrapper;
