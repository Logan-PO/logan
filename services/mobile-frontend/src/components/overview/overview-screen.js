import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OverviewList from './overview-list';

const Stack = createStackNavigator();

class OverviewScreen extends React.Component {
    render() {
        return (
            <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Overview" component={OverviewList} />
            </Stack.Navigator>
        );
    }
}

export default OverviewScreen;
