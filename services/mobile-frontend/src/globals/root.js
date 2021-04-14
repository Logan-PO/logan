import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { NativeModules } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer as NavigationProvider } from '@react-navigation/native';
import { store } from '@logan/fe-shared';
import NavigationHierarchy from './navigation-hierarchy';
import firebase from 'firebase';
import ThemedPaperProvider from './themed-paper-provider';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class Root extends React.Component {
    componentDidMount() {
      /*
      *     These API Keys are meant to be public.
      *     As long as we have proper security rules
      *     on Firebase, no harm can be done with them.
      *     - Henrique Pereira
      */
      var firebaseConfig = {
        apiKey: "AIzaSyDFKoctWHEC-3Dz0r3FhB0BfVkPJ14pFjo",
        authDomain: "logan-289521.firebaseapp.com",
        projectId: "logan-289521",
        storageBucket: "logan-289521.appspot.com",
        messagingSenderId: "850674143860",
        appId: "1:850674143860:web:96a90475fa881f47a0b721",
        measurementId: "G-828XVXP7P7"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      //firebase.analytics();
    }
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
