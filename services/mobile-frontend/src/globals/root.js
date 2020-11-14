import React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { store } from '@logan/fe-shared';
import theme from './theme';

class Root extends React.Component {
    render() {
        return (
            <ReduxProvider store={store}>
                <PaperProvider theme={theme}>{this.props.children}</PaperProvider>
            </ReduxProvider>
        );
    }
}

Root.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Root;
