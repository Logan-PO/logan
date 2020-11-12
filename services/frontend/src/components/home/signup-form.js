import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button } from '@material-ui/core';
import { LOGIN_STAGE, setLoginStage, createNewUser } from '@logan/fe-shared/store/login';

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            username: '',
            email: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth={true} maxWidth="xs">
                <DialogTitle>Create Account</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                onChange={this.handleChange.bind(this, 'name')}
                                value={this.state.name}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Username"
                                autoFocus
                                onChange={this.handleChange.bind(this, 'username')}
                                value={this.state.username}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Email" disabled value={this.state.email} fullWidth />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.handleSubmit}>
                        Signup
                    </Button>
                </DialogActions>
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
