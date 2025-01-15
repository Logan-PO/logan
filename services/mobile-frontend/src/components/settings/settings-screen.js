import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './settings';
import { setLoginStage } from 'packages/fe-shared/store/login';

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
