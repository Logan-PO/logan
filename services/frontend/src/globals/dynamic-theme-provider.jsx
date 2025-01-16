import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { colors } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { makeTheme } from './theme';

const DynamicThemeProvider = ({ primary, accent, children, ...rest }) => {
    const theme = makeTheme({ primary, accent });

    return (
        <ThemeProvider theme={theme} {..._.omit(rest, 'dispatch')}>
            {children}
        </ThemeProvider>
    );
};

DynamicThemeProvider.propTypes = {
    primary: PropTypes.object,
    accent: PropTypes.object,
    children: PropTypes.node,
};

const mapStateToProps = state => {
    const props = {};

    if (state.login.user && state.login.user.primaryColor) {
        props.primary = colors[state.login.user.primaryColor];
    }

    if (state.login.user && state.login.user.accentColor) {
        props.accent = colors[state.login.user.accentColor];
    }

    return props;
};

export default connect(mapStateToProps, undefined)(DynamicThemeProvider);
