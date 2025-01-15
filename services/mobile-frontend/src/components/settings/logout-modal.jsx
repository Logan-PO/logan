import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Dialog } from 'react-native-paper';
import { View } from 'react-native';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from 'packages/fe-shared/store/login';

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
        this.props.navigation.navigate('Home');
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="sm">
                <Dialog.Content>
                    <Dialog.Title>Are you sure?</Dialog.Title>
                </Dialog.Content>
                <Dialog.Actions>
                    <View>
                        <Button variant="contained" color="primary" disableElevation onClick={this.logout}>
                            Yes
                        </Button>
                        <Button variant="contained" color="primary" disableElevation onClick={this.close}>
                            No
                        </Button>
                    </View>
                </Dialog.Actions>
            </Dialog>
        );
    }
}

LogOutModal.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
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
