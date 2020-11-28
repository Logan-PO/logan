import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { setLoginStage } from '@logan/fe-shared/store/login';

import Settings from './settings';

const Stack = createStackNavigator();

class SettingsScreen extends React.Component {
    render() {
        return (
            <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Setting" component={Settings} />
            </Stack.Navigator>
        );
    }
}

SettingsScreen.propTypes = {
    user: PropTypes.object,
    updateUser: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

const mapDispatchToProps = {
    setLoginStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
