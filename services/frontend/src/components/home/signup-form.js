import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LOGIN_STAGE, setLoginStage, createNewUser } from '@logan/fe-shared/store/login';
import Dialog from '@material-ui/core/Dialog';
import Typography from '../shared/typography';
import ActionButton from '../shared/controls/action-button';
import InputGroup from '../shared/controls/input-group';
import TextInput from '../shared/controls/text-input';
import styles from './signup-form.module.scss';
import GoogleBtn from './GoogleButton';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            username: '',
            email: '',
            usernameIsValid: true,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        if (this.props.loginStage !== LOGIN_STAGE.LOGIN && this.props.loginStage !== LOGIN_STAGE.CREATE) {
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

        const isValid = (this.state.username || '').trim().length > 0;

        if (isValid) {
            const response = await this.props.createNewUser(_.pick(this.state, ['name', 'email', 'username']));

            if (response.error) {
                this.setState({ usernameIsValid: false });
            } else {
                this.setState({ usernameIsValid: true });
            }
        } else {
            this.setState({ usernameIsValid: false });
        }
    }

    _googleSignInPrompt() {
        return (
            <React.Fragment>
                <Typography className={styles.title} variant="navbar-1" useHeaderFont>
                    Create Account
                </Typography>
                <div className={styles.content}>
                    <Typography>Thank you for choosing to use our service! We hope you’ll find it useful.</Typography>
                    <Typography>Sign in with your Google account to get started.</Typography>
                </div>
                <div className={styles.actions}>
                    <ActionButton className={styles.cancelButton} textColor="white" onClick={this.props.onClose}>
                        Cancel
                    </ActionButton>
                    <div className={styles.flexibleSpace} />
                    <GoogleBtn />
                </div>
            </React.Fragment>
        );
    }

    _enterInfoPrompt() {
        return (
            <React.Fragment>
                <Typography className={styles.title} variant="navbar-1" useHeaderFont>
                    Create Account
                </Typography>
                <div className={styles.content}>
                    <Typography>Thank you for choosing to use our service! We hope you’ll find it useful.</Typography>
                    <Typography>
                        Great! We’ve autofilled your name and email from your Google account, just choose a username and
                        you’ll be good to go!
                    </Typography>
                    <div className={styles.formContainer}>
                        <InputGroup
                            className={styles.inputGroup}
                            label="Name"
                            content={
                                <TextInput onChange={this.handleChange.bind(this, 'name')} value={this.state.name} />
                            }
                        />
                        <InputGroup
                            className={styles.inputGroup}
                            label="Username"
                            content={
                                <TextInput
                                    placeholder="Enter a username"
                                    onChange={this.handleChange.bind(this, 'username')}
                                    value={this.state.username}
                                />
                            }
                            error={!this.state.usernameIsValid}
                            helperText={
                                this.state.usernameIsValid ? undefined : 'This username is either taken or invalid'
                            }
                        />
                        <InputGroup
                            className={styles.inputGroup}
                            label="Email"
                            content={<Typography>{this.state.email}</Typography>}
                        />
                    </div>
                </div>
                <div className={styles.actions}>
                    <ActionButton className={styles.cancelButton} textColor="white" onClick={this.props.onClose}>
                        Cancel
                    </ActionButton>
                    <div className={styles.flexibleSpace} />
                    <ActionButton onClick={this.handleSubmit}>Create account</ActionButton>
                </div>
            </React.Fragment>
        );
    }

    _getCurrentContent() {
        if (this.props.loginStage === LOGIN_STAGE.LOGIN) {
            return this._googleSignInPrompt();
        } else if (this.props.loginStage === LOGIN_STAGE.CREATE) {
            return this._enterInfoPrompt();
        }
    }

    render() {
        return (
            <Dialog
                classes={{ paper: styles.dialog }}
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
                maxWidth="sm"
            >
                {this._getCurrentContent()}
            </Dialog>
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
