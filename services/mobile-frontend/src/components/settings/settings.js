import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchSelf, setLoginStage, LOGIN_STAGE } from '@logan/fe-shared/store/login';
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper';
import { View } from 'react-native';
import { deleteUser, updateUser } from '@logan/fe-shared/store/settings';
import ViewController from '../shared/view-controller';
import MobileLoginButton from '../home/mobile-login-button';
import { typographyStyles } from '../shared/typography';

export class Settings extends React.Component {
    constructor(props) {
        //TODO: Need to have modals only render when needed
        super(props);

        this.setState = this.setState.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.openUsernameChange = this.openUsernameChange.bind(this);
        this.closeUsernameChange = this.closeUsernameChange.bind(this);

        this.state = {
            user: props.user,
            changeUserName: false,
            deleteConfirmation: false,
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

    async componentDidUpdate(prevProps) {
        //Do nothing if state doesn't update meaningfully
        if (_.isEqual(this.props, prevProps)) return;

        if (this.props.loginStage === LOGIN_STAGE.LOGIN) {
            this.props.navigation.navigate('Home');
        }
    }

    openUsernameChange() {
        this.setState({ changeUserName: true });
    }

    closeUsernameChange() {
        this.setState({ changeUserName: false });
        return this.updateUser();
    }

    hideDeleteConfirmation() {
        this.state.deleteConfirmationCallbacks.deny();
        this.setState({ deleteConfirmation: false, deleteConfirmationCallbacks: undefined });
    }
    openDeleteConfirmation(callbacks) {
        this.setState({ deleteConfirmation: true, deleteConfirmationCallbacks: callbacks });
    }

    logout() {
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
        this.props.navigation.navigate('Home');
    }

    async deleteUser() {
        const callback = this.state.deleteConfirmationCallbacks.confirm;
        this.setState({ deleteConfirmation: false, deleteConfirmationCallbacks: undefined });
        await callback();
        await this.props.deleteUser(this.state.user);
        this.logout();
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
                                    onChangeText={this.handleChange.bind(this)}
                                />
                                <Button onPress={this.closeUsernameChange}>Confirm</Button>
                            </View>
                        )}
                    </View>
                    <Button onPress={this.openUsernameChange}>Change Username</Button>
                    <View>
                        <MobileLoginButton />
                    </View>
                    <View>
                        <Button onPress={this.openDeleteConfirmation}>Delete Account</Button>
                    </View>
                </View>
                <Portal>
                    <Dialog visible={this.state.deleteConfirmation} onDismiss={this.hideDeleteConfirmation}>
                        <Dialog.Title>Are you sure?</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{`You're about to delete your account.\nThis cannot be undone.`}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.hideDeleteConfirmation} labelStyle={typographyStyles.button}>
                                Cancel
                            </Button>
                            <Button onPress={this.deleteUser} color="red" labelStyle={typographyStyles.button}>
                                Delete
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ViewController>
        );
    }
}

Settings.propTypes = {
    setLoginStage: PropTypes.func,
    deleteUser: PropTypes.func,
    route: PropTypes.object,
    navigation: PropTypes.object,
    loginStage: PropTypes.string,
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    updateUser: PropTypes.func,
    fetchSelf: PropTypes.func,
};

const mapStateToProps = state => ({
    loginStage: state.login.currentStage,
    user: state.login.user,
});

const mapDispatchToProps = {
    deleteUser,
    setLoginStage,
    updateUser,
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
