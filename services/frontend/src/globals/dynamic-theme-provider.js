import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { colors } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { makeTheme } from './theme';

const DynamicThemeProvider = ({ primary, accent, children, ...rest }) => {
    const theme = makeTheme({ primary, accent });

    return (
        <ThemeProvider theme={theme} {...rest}>
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
