import React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@logan/fe-shared';

class Root extends React.Component {
    render() {
        return <ReduxProvider store={store}>{this.props.children}</ReduxProvider>;
    }
}

Root.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Root;
