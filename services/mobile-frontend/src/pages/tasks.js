import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

export default class Tasks extends React.Component {
    render() {
        return (
            <View>
                <Text>Test task page</Text>
                <StatusBar style="auto" />
            </View>
        );
    }
}
