import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { NativeModules } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer as NavigationProvider } from '@react-navigation/native';
import { store } from 'packages/fe-shared';
import NavigationHierarchy from './navigation-hierarchy';
import ThemedPaperProvider from './themed-paper-provider';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class Root extends React.Component {
    render() {
        return (
            <SafeAreaProvider>
                <ReduxProvider store={store}>
                    <ThemedPaperProvider>
                        <NavigationProvider>
                            <NavigationHierarchy />
                        </NavigationProvider>
                    </ThemedPaperProvider>
                </ReduxProvider>
            </SafeAreaProvider>
        );
    }
}
