import React from 'react';
import _ from 'lodash';
import { createNewUser, LOGIN_STAGE, setLoginStage } from '@logan/fe-shared/store/login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import Typography from '../shared/typography';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { name: '', username: '', email: '' };
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        if (this.props.loginStage !== LOGIN_STAGE.CREATE) {
            this.props.onClose();
        } else {
            this.setState({
                name: _.get(this.props, ['meta', 'name'], ''),
                username: '',
                email: _.get(this.props, ['meta', 'email'], ''),
            });
        }
    }

    handleChange(prop, e) {
        this.setState({ [prop]: e.target.value });
    }

    async handleSubmit(e) {
        e.preventDefault();
        await this.props.createNewUser(this.state);
    }

    render() {
        return (
            <Modal visible={this.props.open} onRequestClose={this.props.onClose}>
                <Typography variant="h6">Create Account</Typography>
            </Modal>
        );
    }
}

SignUpForm.propTypes = {
    meta: PropTypes.object,
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
