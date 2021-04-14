import React from 'react';
import { View, Text, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Card } from 'react-native-paper';
import { connect } from 'react-redux';
import firebase from 'firebase';
import Typography from '../shared/typography';
import { StatusBar } from 'expo-status-bar';
import NavigationButton from '../tutorial/navigation-button';
import { fetchSelf, LOGIN_STAGE, setLoginStage } from '@logan/fe-shared/store/login';

class RegForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { email: '', password: '', error: '', loading: false};

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(prop, e) {
      this.setState({ [prop]: e });
  }

  handleSubmit() {
    const {email, password} = this.state;

    this.setState({error: '', loading: true})

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(this.onLoginFail.bind(this))
  }

  onLoginSuccess() {
    this.setState({
      email: '',
      password: '',
      error: '',
      loading: false
    });
    this.props.setLoginStage(LOGIN_STAGE.DONE);
    this.props.navigation.navigate('Root');
  }

  onLoginFail() {
    this.setState({
      email: '',
      password: '',
      error: 'Network Error.',
      loading: false
    });
  }

  renderButton() {
    if(this.state.loading) {
      return (
        <ActivityIndicator animating={true} color="black" size="large" />
      )
    } else {
      return (
        <Button color="teal" mode="contained" onPress={this.handleSubmit}>
            Submit
        </Button>
      )
    }

  }
  render() {
    let textWidth = '90%';
    return(
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
              Create An Account
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

          <View style={{ width: textWidth }}>
            <TextInput
              style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
              mode="flat"
              label="Password"
              value={this.state.password}
              onChangeText={this.handleChange.bind(this, 'password')}
            />
          </View>
          </Card.Content>

          <Card.Actions style={{ alignSelf: 'center' }}>
              {this.renderButton()}
          </Card.Actions>

          <View style={{ width: textWidth }}>
            <Text style={styles.errorTextStyle}>
              {this.state.error}
            </Text>
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
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
}

const mapStateToProps = state => ({
  user: state.login.user,
  loginStage: state.login.currentStage,
});

const mapDispatchToProps = {
    setLoginStage
};

export default connect(mapStateToProps, mapDispatchToProps)(RegForm);
