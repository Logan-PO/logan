import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button } from '@material-ui/core';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from '../../store/login';
import styles from './settings-page.module.scss';

class LogOutModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            user: {
                uid: _.get(this.props, 'user.uid'),
                name: _.get(this.props, 'user.name'),
                email: _.get(this.props, 'user.email'),
                username: _.get(this.props, 'user.username'),
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

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="sm">
                <DialogContent>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogContent>
                <DialogActions className={styles.yes}>
                    <div>
                        <Button variant="contained" color="primary" disableElevation onClick={this.logout}>
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

LogOutModal.propTypes = {
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    loginStage: PropTypes.string,
    setLoginStage: PropTypes.func,
    fetchSelf: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
    loginStage: state.login.currentStage,
});

const mapDispatchToProps = {
    setLoginStage,
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogOutModal);
