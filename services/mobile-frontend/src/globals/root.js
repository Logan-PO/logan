import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer as NavigationProvider } from '@react-navigation/native';
import { store } from '@logan/fe-shared';
import theme from './theme';
import NavigationHierarchy from './navigation-hierarchy';

export default class Root extends React.Component {
    render() {
        return (
            <ReduxProvider store={store}>
                <PaperProvider theme={theme}>
                    <NavigationProvider>
                        <NavigationHierarchy />
                    </NavigationProvider>
                </PaperProvider>
            </ReduxProvider>
        );
    }
}
