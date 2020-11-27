import React from 'react';
import _ from 'lodash';
import { createNewUser, LOGIN_STAGE, setLoginStage } from '@logan/fe-shared/store/login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SafeAreaView, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
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
        return (
            <SafeAreaView>
                <Typography variant="h6">Create Account</Typography>
                <TextInput
                    style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                    mode="flat"
                    label="Name"
                    value={this.state.name}
                    onChangeText={this.handleChange.bind(this, 'name')}
                />
                <TextInput
                    style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                    mode="flat"
                    label="Username"
                    value={this.state.username}
                    onChangeText={this.handleChange.bind(this, 'username')}
                />
                <TextInput
                    style={{ paddingHorizontal: 0, flexGrow: 1, backgroundColor: 'none' }}
                    mode="flat"
                    label="Email"
                    value={this.state.email}
                    onChangeText={this.handleChange.bind(this, 'email')}
                />
                <Button title="Submit" onPress={this.handleSubmit} />
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
