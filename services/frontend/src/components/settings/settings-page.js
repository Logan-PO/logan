import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import { Page } from '../shared';
import { setLoginStage } from '../../store/login';
import UsernameModal from './username-modal';
import DeleteModal from './delete-modal';
import styles from './settings-page.module.scss';

export class SettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.openNewUsernameModal = this.openNewUsernameModal.bind(this);
        this.closeNewUsernameModal = this.closeNewUsernameModal.bind(this);
        this.openNewDeleteModal = this.openNewDeleteModal.bind(this);
        this.closeNewDeleteModal = this.closeNewDeleteModal.bind(this);

        this.state = {
            newUsernameModal: false,
            newDeleteModal: false,
        };
    }

    openNewUsernameModal() {
        this.setState({ newUsernameModal: true });
    }

    closeNewUsernameModal() {
        this.setState({ newUsernameModal: false });
    }

    openNewDeleteModal() {
        this.setState({ newDeleteModal: true });
    }

    closeNewDeleteModal() {
        this.setState({ newDeleteModal: false });
    }

    render() {
        return (
            <Page title="Settings">
                <div className={styles.username}>
                    <TextField
                        label="Username"
                        InputProps={{
                            readOnly: true,
                        }}
                        value={_.get(this.props, 'user.username')}
                    />
                </div>
                <div className={styles.change}>
                    <Button variant="contained" color="primary" disableElevation onClick={this.openNewUsernameModal}>
                        Change Username
                    </Button>
                    <UsernameModal open={this.state.newUsernameModal} onClose={this.closeNewUsernameModal} />
                </div>
                <div className={styles.delete}>
                    <Button variant="contained" color="primary" disableElevation onClick={this.openNewDeleteModal}>
                        Delete Account
                    </Button>
                    <DeleteModal open={this.state.newDeleteModal} onClose={this.closeNewDeleteModal} />
                </div>
            </Page>
        );
    }
}

SettingsPage.propTypes = {
    user: PropTypes.object,
    updateUser: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

const mapDispatchToProps = {
    setLoginStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
