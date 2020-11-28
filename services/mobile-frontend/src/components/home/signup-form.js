import React from 'react';
import _ from 'lodash';
import { createNewUser, LOGIN_STAGE, setLoginStage } from '@logan/fe-shared/store/login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import Typography from '../shared/typography';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { name: '', username: '', email: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        if (this.props.loginStage !== LOGIN_STAGE.CREATE) {
            this.props.navigation.navigate('Root');
        } else {
            this.setState({
                name: _.get(this.props, ['meta', 'name'], ''),
                username: '',
                email: _.get(this.props, ['meta', 'email'], ''),
            });
        }
    }

    handleChange(prop, e) {
        this.setState({ [prop]: e });
    }

    async handleSubmit(e) {
        e.preventDefault();
        await this.props.createNewUser(this.state);
    }

    render() {
        let textWidth = '90%';
        return (
            <SafeAreaView style={{ backgroundColor: 'teal', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ alignSelf: 'center', height: '15%' }}>
                    <Typography color="white" variant="h4">
                        Create Account
                    </Typography>
                </View>
                <Card style={{ width: '90%', justifyContent: 'center' }}>
                    <Card.Content>
                        <View style={{ width: textWidth }}>
                            <TextInput
                                style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                                mode="flat"
                                label="Name"
                                value={this.state.name}
                                onChangeText={this.handleChange.bind(this, 'name')}
                            />
                        </View>
                        <View style={{ width: textWidth }}>
                            <TextInput
                                style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                                mode="flat"
                                label="Username"
                                value={this.state.username}
                                onChangeText={this.handleChange.bind(this, 'username')}
                            />
                        </View>
                        <View style={{ width: textWidth }}>
                            <TextInput
                                style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                                mode="flat"
                                label="Email"
                                value={this.state.email}
                                onChangeText={this.handleChange.bind(this, 'email')}
                            />
                        </View>
                        <Card.Actions style={{ alignSelf: 'center' }}>
                            <Button color="teal" mode="contained" onPress={this.handleSubmit}>
                                Submit
                            </Button>
                        </Card.Actions>
                    </Card.Content>
                </Card>
            </SafeAreaView>
        );
    }
}

SignUpForm.propTypes = {
    meta: PropTypes.object,
    navigation: PropTypes.object,
    loginStage: PropTypes.string,
    setLoginStage: PropTypes.func,
    createNewUser: PropTypes.func,
    open: PropTypes.bool,
    onClose: PropTypes.func,
};

const mapStateToProps = state => ({
    loginStage: state.login.currentStage,
    meta: state.login.userMeta,
});

const mapDispatchToProps = {
    setLoginStage,
    createNewUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
