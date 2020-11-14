import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

export default class Tasks extends React.Component {
    render() {
        return (
            <View>
                <Appbar.Header dark>
                    <Appbar.Action icon="sync" />
                    <Appbar.Content title="Tasks" />
                </Appbar.Header>
                <Text>Test task page</Text>
                <StatusBar style="auto" />
            </View>
        );
    }
}
