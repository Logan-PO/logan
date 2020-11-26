import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MobileLoginButton from '../components/home/mobile-login-button';

class Home extends React.Component {
    render() {
        return (
            <SafeAreaView>
                <MobileLoginButton />
            </SafeAreaView>
        );
    }
}

export default Home;
