import React from 'react';
import { navigate } from 'gatsby';
import api from '../../utils/api';

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
        console.log(this.state);
        event.preventDefault();

        /*
        await axios
            .post(BASE_URL + USER_ROUTE, {
                name: this.state.name,
                email: this.state.email,
                username: this.state.username,
            })
            .then(res => {
                console.log(res);
                api.setBearerToken(res.token);
            })
            .catch(error => {
                console.log(error);
            });

         */
        let res = await api.createNewUser(this.state);
        console.log(res);
        await api.setBearerToken(res.token);
        await navigate('../');
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.name} onChange={this.handleNameChange} />
                </label>
                <label>
                    Username:
                    <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
                </label>
                <label>
                    Email:
                    <input type="text" value={this.state.email} onChange={this.handleEmailChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default SignUpForm;
