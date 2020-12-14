import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { NativeModules } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer as NavigationProvider } from '@react-navigation/native';
import { store } from '@logan/fe-shared';
import theme from './theme';
import NavigationHierarchy from './navigation-hierarchy';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class Root extends React.Component {
    render() {
        return (
            <SafeAreaProvider>
                <ReduxProvider store={store}>
                    <PaperProvider theme={theme}>
                        <NavigationProvider>
                            <NavigationHierarchy />
                        </NavigationProvider>
                    </PaperProvider>
                </ReduxProvider>
            </SafeAreaProvider>
        );
    }
}
