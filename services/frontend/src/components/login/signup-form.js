import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Container, Grid, TextField, Button } from '@material-ui/core';
import api from '../../utils/api';
import { LOGIN_STAGE, setLoginStage } from '../../store/login';
import styles from './signup.modules.scss';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: _.get(props, ['meta', 'name'], ''),
            username: '',
            email: _.get(props, ['meta', 'email'], ''),
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.loginStage === LOGIN_STAGE.LOGIN) {
            navigate('../login');
        } else if (this.props.loginStage !== LOGIN_STAGE.CREATE) {
            navigate('../');
        }
    }

    componentDidUpdate() {
        if (this.props.loginStage !== LOGIN_STAGE.CREATE) {
            navigate('../');
        }
    }

    handleChange(prop, e) {
        this.setState({ [prop]: e.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let res = await api.createNewUser(this.state);
        await api.setBearerToken(res.token);
        this.props.setLoginStage(LOGIN_STAGE.DONE);
    }

    render() {
        return (
            <div className={styles.signupForm}>
                <Container>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                onChange={this.handleChange.bind(this, 'name')}
                                value={this.state.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Username"
                                onChange={this.handleChange.bind(this, 'username')}
                                value={this.state.username}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Email" disabled value={this.state.email} />
                        </Grid>
                    </Grid>
                    <div>
                        <Button variant="outlined" color="primary" onClick={this.handleSubmit}>
                            Signup
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }
}

SignUpForm.propTypes = {
    meta: PropTypes.object,
    loginStage: PropTypes.string,
    setLoginStage: PropTypes.func,
};

const mapStateToProps = state => ({
    loginStage: state.login.currentStage,
    meta: state.login.userMeta,
});

const mapDispatchToProps = {
    setLoginStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
