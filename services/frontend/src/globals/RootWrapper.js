import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';
import store from '../store';
import theme from './theme';

function wrapper({ element }) {
    return (
        <MuiPickersUtilsProvider utils={DayJsUtils}>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <CssBaseline />
                    {element}
                </Provider>
            </ThemeProvider>
        </MuiPickersUtilsProvider>
    );
}

export default wrapper;
