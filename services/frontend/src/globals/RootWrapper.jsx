import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';
import DynamicThemeProvider from './dynamic-theme-provider';
import store from 'packages/fe-shared/store';

function wrapper({ element }) {
    return (
        <StoreProvider store={store}>
            <MuiPickersUtilsProvider utils={DayJsUtils}>
                <DynamicThemeProvider>
                    <CssBaseline />
                    {element}
                </DynamicThemeProvider>
            </MuiPickersUtilsProvider>
        </StoreProvider>
    );
}

export default wrapper;
