import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchSelf, setLoginStage } from '@logan/fe-shared/store/login';
import { Button, TextInput } from 'react-native-paper';
import { View } from 'react-native';
import { deleteUser, updateUser } from '@logan/fe-shared/store/settings';
import ViewController from '../shared/view-controller';
import DeleteModal from './delete-modal';
import LogOutModal from './logout-modal';

export class Settings extends React.Component {
    constructor(props) {
        //TODO: Need to have modals only render when needed
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.openUsernameChange = this.openUsernameChange.bind(this);
        this.closeUsernameChange = this.closeUsernameChange.bind(this);

        this.state = {
            user: props.user,
            changeUserName: false,
            newDeleteModal: false,
            newLogOutModal: false,
        };
    }

    async updateUser() {
        await this.props.updateUser(_.get(this, 'state.user'));
        this.props.fetchSelf();
    }

    handleChange(username) {
        const user = this.state.user;
        this.setState({ user: { email: user.email, name: user.name, uid: user.uid, username: username } });
        return this.updateUser();
    }

    openUsernameChange() {
        this.setState({ changeUserName: true });
    }

    closeUsernameChange() {
        this.setState({ changeUserName: false });
        return this.updateUser();
    }

    render() {
        return (
            <ViewController
                title="Settings"
                navigation={this.props.navigation}
                route={this.props.route}
                leftActionIsFetch={false}
                rightActionIsSetting={false}
            >
                <View>
                    <View>
                        {this.state.changeUserName && (
                            <View>
                                <TextInput
                                    multiline
                                    label="Username"
                                    mode="flat"
                                    style={{ backgroundColor: 'none', paddingHorizontal: 0 }}
                                    value={this.state.user.username}
                                    onChangeText={this.handleChange.bind(this, 'username')}
                                />
                                <Button onPress={this.closeUsernameChange}>Confirm</Button>
                            </View>
                        )}
                    </View>
                    <Button onPress={this.openUsernameChange}>Change Username</Button>
                    <View>
                        <Button onPress={this.openNewLogOutModal}>Logout</Button>
                        <LogOutModal
                            route={this.props.route}
                            navigation={this.props.navigation}
                            open={this.state.newLogOutModal}
                            onClose={this.closeNewLogOutModal}
                        />
                    </View>
                    <View>
                        <Button onClick={this.openNewDeleteModal}>Delete Account</Button>
                        <DeleteModal
                            route={this.props.route}
                            navigation={this.props.navigation}
                            open={this.state.newDeleteModal}
                            onClose={this.closeNewDeleteModal}
                        />
                    </View>
                </View>
            </ViewController>
        );
    }
}

Settings.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
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
    deleteUser,
    setLoginStage,
    updateUser,
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
