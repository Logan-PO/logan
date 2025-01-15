import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core';
import styles from './settings-page.module.scss';
import { deleteUser } from 'packages/fe-shared/store/settings';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from 'packages/fe-shared/store/login';

class DeleteModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.logout = this.logout.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

        this.state = {
            user: {
                uid: _.get(this.props, 'user.uid'),
                name: _.get(this.props, 'user.name'),
                email: _.get(this.props, 'user.email'),
                username: _.get(this.props, 'user.username'),
                tokens: _.get(this.props, 'user.tokens'),
            },
        };
    }

    close() {
        this.props.onClose();
    }

    logout() {
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
        navigate('/');
    }

    async deleteUser() {
        await this.props.deleteUser(this.state.user);
        this.logout();
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="sm">
                <DialogContent>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogContent>
                <DialogActions className={styles.yes}>
                    <div>
                        <Button variant="contained" color="primary" disableElevation onClick={this.deleteUser}>
                            Yes
                        </Button>
                        <Button variant="contained" color="primary" disableElevation onClick={this.close}>
                            No
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

DeleteModal.propTypes = {
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    loginStage: PropTypes.string,
    setLoginStage: PropTypes.func,
    deleteUser: PropTypes.func,
    fetchSelf: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
    loginStage: state.login.currentStage,
});

const mapDispatchToProps = {
    setLoginStage,
    fetchSelf,
    deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);
