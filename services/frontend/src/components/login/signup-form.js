import React from 'react';
import { navigate } from 'gatsby';
import { Grid, TextField, Button } from '@material-ui/core';
import api from '../../utils/api';
import styles from './signup.modules.scss';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', username: '', email: '' };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let res = await api.createNewUser(this.state);
        await api.setBearerToken(res.token);
        await navigate('../');
    }

    render() {
        return (
            <div className={styles.signupForm}>
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                        <TextField label="Name" onChange={this.handleNameChange} value={this.state.name} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Username" onChange={this.handleUsernameChange} value={this.state.username} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Email" onChange={this.handleEmailChange} value={this.state.email} />
                    </Grid>
                </Grid>
                <div>
                    <Button variant="outlined" color="primary" onClick={this.handleSubmit}>
                        Signup
                    </Button>
                </div>
            </div>
        );
    }
}

export default SignUpForm;
