import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { navigate } from 'gatsby';
import styles from './account-dialog.module.scss';
import { LOGIN_STAGE, setLoginStage } from 'packages/fe-shared/store/login';

class AccountDialog extends React.Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
        navigate('/');
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                className={styles.accountDialog}
                fullWidth={true}
                maxWidth="xs"
            >
                <DialogTitle>My Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>{_.get(this.props, 'user.name')}</DialogContentText>
                    <DialogContentText>{_.get(this.props, 'user.username')}</DialogContentText>
                    <DialogContentText>{_.get(this.props, 'user.email')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button disabled color="primary">
                        Delete Account
                    </Button>
                    <Button onClick={this.logout} color="primary">
                        Log Out
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

AccountDialog.propTypes = {
    open: PropTypes.bool,
    user: PropTypes.object,
    loginStage: PropTypes.string,
    setLoginStage: PropTypes.func,
    onClose: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
    loginStage: state.login.currentStage,
});

const mapDispatchToProps = {
    setLoginStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountDialog);
