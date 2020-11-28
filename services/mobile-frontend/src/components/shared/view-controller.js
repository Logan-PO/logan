import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './header';

class ViewController extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar style={this.props.statusBarStyle} />
                {!this.props.disableHeader && (
                    <Header
                        {..._.pick(this.props, [
                            'title',
                            'navigation',
                            'route',
                            'disableBack',
                            'leftActionIsFetch',
                            'leftActions',
                            'rightActions',
                            'rightActionIsSetting',
                        ])}
                    />
                )}
                <View style={{ background: 'white', flex: 1 }}>{this.props.children}</View>
            </View>
        );
    }
}

ViewController.propTypes = {
    statusBarStyle: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    navigation: PropTypes.object,
    route: PropTypes.object,
    disableHeader: PropTypes.bool,
    disableBack: PropTypes.bool,
    leftActionIsFetch: PropTypes.bool,
    leftActions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightActions: PropTypes.object,
    rightActionIsSetting: PropTypes.bool,
};

ViewController.defaultProps = {
    statusBarStyle: 'light',
};

export default ViewController;
