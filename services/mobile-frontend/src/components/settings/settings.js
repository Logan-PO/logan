import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setLoginStage } from '@logan/fe-shared/store/login';
import { Button, TextInput } from 'react-native-paper';
import { View } from 'react-native-web';
import UsernameModal from './username-modal';
import DeleteModal from './delete-modal';
import LogOutModal from './logout-modal';

export class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.openNewUsernameModal = this.openNewUsernameModal.bind(this);
        this.closeNewUsernameModal = this.closeNewUsernameModal.bind(this);
        this.openNewDeleteModal = this.openNewDeleteModal.bind(this);
        this.closeNewDeleteModal = this.closeNewDeleteModal.bind(this);
        this.openNewLogOutModal = this.openNewLogOutModal.bind(this);
        this.closeNewLogOutModal = this.closeNewLogOutModal.bind(this);

        this.state = {
            newUsernameModal: false,
            newDeleteModal: false,
            newLogOutModal: false,
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

    openNewLogOutModal() {
        this.setState({ newLogOutModal: true });
    }

    closeNewLogOutModal() {
        this.setState({ newLogOutModal: false });
    }

    render() {
        return (
            <View>
                <View>
                    <TextInput
                        label="Username"
                        InputProps={{
                            readOnly: true,
                        }}
                        value={_.get(this.props, 'user.username', '')}
                    />
                </View>
                <View>
                    <TextInput
                        label="Name"
                        InputProps={{
                            readOnly: true,
                        }}
                        value={_.get(this.props, 'user.name', '')}
                    />
                </View>
                <View>
                    <TextInput
                        label="Email"
                        InputProps={{
                            readOnly: true,
                        }}
                        value={_.get(this.props, 'user.email', '')}
                    />
                </View>
                <View>
                    <Button variant="contained" color="primary" disableElevation onClick={this.openNewUsernameModal}>
                        Change Username
                    </Button>
                    <UsernameModal
                        route={this.props.route}
                        navigation={this.props.navigation}
                        open={this.state.newUsernameModal}
                        onClose={this.closeNewUsernameModal}
                    />
                </View>
                <View>
                    <Button variant="contained" color="primary" disableElevation onClick={this.openNewLogOutModal}>
                        Logout
                    </Button>
                    <LogOutModal
                        route={this.props.route}
                        navigation={this.props.navigation}
                        open={this.state.newLogOutModal}
                        onClose={this.closeNewLogOutModal}
                    />
                </View>
                <View>
                    <Button variant="contained" color="primary" disableElevation onClick={this.openNewDeleteModal}>
                        Delete Account
                    </Button>
                    <DeleteModal
                        route={this.props.route}
                        navigation={this.props.navigation}
                        open={this.state.newDeleteModal}
                        onClose={this.closeNewDeleteModal}
                    />
                </View>
            </View>
        );
    }
}

Settings.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
    user: PropTypes.object,
    updateUser: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

const mapDispatchToProps = {
    setLoginStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
