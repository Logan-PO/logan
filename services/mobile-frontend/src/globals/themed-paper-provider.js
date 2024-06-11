import React from 'react';
import { AppLoading } from 'expo';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import * as MaterialColors from 'material-ui-colors';
import { useFonts, Rubik_400Regular as Rubik400, Rubik_500Medium as Rubik500 } from '@expo-google-fonts/rubik';
import {
    Poppins_500Medium as Poppins500,
    Poppins_600SemiBold as Poppins600,
    Poppins_700Bold as Poppins700,
} from '@expo-google-fonts/poppins';
import { makeTheme } from './theme';

const ThemedPaperProvider = ({ primary, accent, children, ...rest }) => {
    let [fontsLoaded] = useFonts({ Rubik400, Rubik500, Poppins500, Poppins600, Poppins700 });
    if (!fontsLoaded) return <AppLoading />;

    const theme = makeTheme({ primary, accent }, { fonts: { regular: Rubik400, medium: Rubik500 } });

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
