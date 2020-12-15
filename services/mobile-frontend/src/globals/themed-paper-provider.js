import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import * as MaterialColors from 'material-ui-colors';
import { makeTheme } from './theme';

const ThemedPaperProvider = ({ primary, accent, children, ...rest }) => {
    const theme = makeTheme({ primary, accent });

    return (
        <PaperProvider theme={theme} {...rest}>
            {children}
        </PaperProvider>
    );
};

ThemedPaperProvider.propTypes = {
    primary: PropTypes.object,
    accent: PropTypes.object,
    children: PropTypes.node,
};

const mapStateToProps = state => {
    const props = {};

    if (state.login.user && state.login.user.primaryColor) {
        props.primary = MaterialColors[state.login.user.primaryColor];
    }

    if (state.login.user && state.login.user.accentColor) {
        props.accent = MaterialColors[state.login.user.accentColor];
    }

    return props;
};

export default connect(mapStateToProps, null)(ThemedPaperProvider);
