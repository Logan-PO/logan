import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { updateUser } from 'packages/fe-shared/store/settings';
import { setLoginStage, fetchSelf } from 'packages/fe-shared/store/login';

class UsernameModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.updateUser = this.updateUser.bind(this);

        this.state = {
            user: {
                uid: _.get(this.props, 'user.uid'),
                name: _.get(this.props, 'user.name'),
                email: _.get(this.props, 'user.email'),
                tokens: _.get(this.props, 'user.tokens'),
                username: 'empty',
            },
        };
    }

    close() {
        this.props.onClose();
    }

    async updateUser() {
        await this.props.updateUser(this.state.user);
        this.props.fetchSelf();
        this.props.onClose();
    }

    handleChange(prop, e) {
        const user = this.state.user;
        user[prop] = e.target.value;
        this.setState({ user });
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="sm">
                <DialogContent>
                    <TextField label="New Username" fullWidth onChange={this.handleChange.bind(this, 'username')} />
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button variant="contained" color="primary" disableElevation onClick={this.updateUser}>
                            Change
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

UsernameModal.propTypes = {
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    updateUser: PropTypes.func,
    fetchSelf: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

const mapDispatchToProps = {
    setLoginStage,
    updateUser,
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsernameModal);
