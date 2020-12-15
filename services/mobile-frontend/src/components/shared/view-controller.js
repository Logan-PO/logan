import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { getCurrentTheme } from '../../globals/theme';
import Header from './header';

class ViewController extends React.Component {
    render() {
        const statusBarStyle =
            this.props.statusBarStyle || (getCurrentTheme().colors.contrastText === 'white' ? 'light' : 'dark');

        return (
            <View style={{ flex: 1 }}>
                <StatusBar style={statusBarStyle} />
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
                <View style={{ backgroundColor: 'white', flex: 1 }}>
                    <SafeAreaInsetsContext.Consumer>
                        {insets => (
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    flex: 1,
                                    marginLeft: this.props.useSafeMargins ? insets.left : 0,
                                    marginRight: this.props.useSafeMargins ? insets.right : 0,
                                }}
                            >
                                {this.props.children}
                            </View>
                        )}
                    </SafeAreaInsetsContext.Consumer>
                </View>
            </View>
        );
    }
}

ViewController.propTypes = {
    useSafeMargins: PropTypes.bool,
    statusBarStyle: PropTypes.string,
    children: PropTypes.node,
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

export default ViewController;
