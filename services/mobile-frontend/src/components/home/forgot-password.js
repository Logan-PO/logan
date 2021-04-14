import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Card } from 'react-native-paper';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { StatusBar } from 'expo-status-bar';
import { fetchSelf, LOGIN_STAGE, setLoginStage } from '@logan/fe-shared/store/login';
import Typography from '../shared/typography';
import NavigationButton from '../tutorial/navigation-button';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = { email: '', error: '', loading: false };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(prop, e) {
        this.setState({ [prop]: e });
    }

    handleSubmit() {
        const { email } = this.state;

        this.setState({ error: '', loading: true });

        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(this.onLoginSuccess.bind(this))
            .catch(this.onLoginFail.bind(this));
    }

    onLoginSuccess() {
        this.setState({
            email: '',
            password: '',
            error: 'Check Email.',
            loading: false,
        });
    }

    onLoginFail() {
        this.setState({
            email: '',
            password: '',
            error: 'Email Not Recognized.',
            loading: false,
        });
    }

    renderButton() {
        if (this.state.loading) {
            return <ActivityIndicator animating={true} color="black" size="large" />;
        } else {
            return (
                <Button color="teal" mode="contained" onPress={this.handleSubmit}>
                    Submit
                </Button>
            );
        }
    }

    render() {
        let textWidth = '90%';
        return (
            <SafeAreaView
                style={{
                    backgroundColor: 'teal',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 32,
                }}
            >
                <View style={{ alignSelf: 'center', height: '15%' }}>
                    <Typography color="white" variant="h4">
                        Password Reset
                    </Typography>
                </View>

                <Card style={{ width: '90%', justifyContent: 'center' }}>
                    <Card.Content>
                        <View style={{ width: textWidth }}>
                            <TextInput
                                style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                                mode="flat"
                                label="Email"
                                value={this.state.email}
                                onChangeText={this.handleChange.bind(this, 'email')}
                            />
                        </View>
                    </Card.Content>
                    <Card.Actions style={{ alignSelf: 'center' }}>{this.renderButton()}</Card.Actions>
                    /* / Error Styling, Needs To Be Corrected / - Henrique */
                    <View style={{ width: textWidth }}>
                        <Text style={styles.errorTextStyle}>{this.state.error}</Text>
                    </View>
                </Card>
                <View style={{ flex: 1 }} />
                <NavigationButton
                    mode="text"
                    destination="Home"
                    text="Return"
                    navigation={this.props.navigation}
                    color="white"
                    textColor="white"
                />
            </SafeAreaView>
        );
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red',
    },
};

const mapStateToProps = state => ({
    user: state.login.user,
    loginStage: state.login.currentStage,
});

const mapDispatchToProps = {
    setLoginStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
