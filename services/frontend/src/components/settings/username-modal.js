import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { updateUser } from '@logan/fe-shared/store/settings';
import { setLoginStage, fetchSelf } from '@logan/fe-shared/store/login';
import api from '@logan/fe-shared/utils/api';
import SyncComponent from '@logan/fe-shared/components/sync-component';

class UsernameModal extends SyncComponent {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.checkUsernameUniqueness = this.checkUsernameUniqueness.bind(this);
        this.componentWillOpen = this.componentWillOpen.bind(this);

        this.state = {
            newUsername: _.get(props, 'user.username'),
            user: props.user || {},
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.open && !prevProps.open) {
            this.componentWillOpen();
        }
    }

    componentWillOpen() {
        this.setState({
            user: this.props.user || {},
            newUsername: _.get(this.props, 'user.username'),
            validatingUniqueness: false,
            isUnique: true,
        });
    }

    close() {
        this.props.onClose();
    }

    async checkUsernameUniqueness() {
        await this.setStateSync({ validatingUniqueness: true });
        const isUnique = (await api.validateUniqueness(this.state.newUsername)).unique;

        this.setState({
            validatingUniqueness: false,
            isUnique,
        });

        if (isUnique) {
            await this.updateUser();
        }
    }

    async updateUser() {
        await this.props.updateUser(_.merge({}, this.state.user, { username: this.state.newUsername }));
        await this.props.fetchSelf();
        this.props.onClose();
    }

    handleChange(prop, e) {
        this.setState({
            newUsername: e.target.value,
        });
    }

    render() {
        const modified = !_.isEqual(this.state.newUsername, _.get(this.state, 'user.username'));

        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Username</DialogTitle>
                <DialogContent>
                    <TextField
                        value={this.state.newUsername}
                        fullWidth
                        error={!this.state.isUnique}
                        helperText={this.state.isUnique ? undefined : 'Must be unique'}
                        onChange={this.handleChange.bind(this, 'username')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        disabled={!modified}
                        disableElevation
                        onClick={this.checkUsernameUniqueness}
                    >
                        Change
                    </Button>
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
