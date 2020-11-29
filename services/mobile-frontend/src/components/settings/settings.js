import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchSelf, setLoginStage, LOGIN_STAGE } from '@logan/fe-shared/store/login';
import { Appbar, Button, Dialog, Paragraph, Portal, TextInput, Card, Colors } from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import { deleteUser, updateUser } from '@logan/fe-shared/store/settings';
import SyncComponent from '@logan/fe-shared/components/sync-component';
import api from '@logan/fe-shared/utils/api';
import ViewController from '../shared/view-controller';
import MobileLoginButton from '../home/mobile-login-button';
import Typography, { typographyStyles } from '../shared/typography';

export class Settings extends SyncComponent {
    constructor(props) {
        //TODO: Need to have modals only render when needed
        super(props);

        this.setState = this.setState.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.openUsernameChange = this.openUsernameChange.bind(this);
        this.checkUsernameUniqueness = this.checkUsernameUniqueness.bind(this);
        this.closeUsernameChange = this.closeUsernameChange.bind(this);
        this.openDeleteConfirmation = this.openDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

        this.state = {
            user: props.user,
            newUsername: props.user.username,
            changeUserName: false,
            deleteConfirmation: false,
        };
    }

    async updateUser() {
        const user = _.merge({}, this.state.user, { username: this.state.newUsername });

        this.setState({ user });

        return this.props.updateUser(user);
    }

    async handleChange(username) {
        this.setState({
            newUsername: username,
        });
    }

    async componentDidUpdate(prevProps) {
        //Do nothing if state doesn't update meaningfully
        if (_.isEqual(this.props, prevProps)) return;

        if (this.props.loginStage === LOGIN_STAGE.LOGIN) {
            this.props.navigation.navigate('Home');
        }
    }

    openUsernameChange() {
        this.setState({
            newUsername: this.props.user.username,
            changeUserName: true,
            isUnique: true,
        });
    }

    async checkUsernameUniqueness() {
        await this.setStateSync({ validatingUniqueness: true });
        const isUnique = (await api.validateUniqueness(this.state.newUsername)).unique;

        this.setState({
            validatingUniqueness: false,
            isUnique,
        });

        if (isUnique) return this.updateUser();
    }

    closeUsernameChange() {
        this.setState({
            newUsername: this.props.user.username,
            changeUserName: false,
        });
    }

    hideDeleteConfirmation() {
        this.setState({ deleteConfirmation: false });
    }

    openDeleteConfirmation() {
        this.setState({ deleteConfirmation: true });
    }

    logout() {
        this.props.setLoginStage(LOGIN_STAGE.LOGIN);
        this.props.navigation.navigate('Home');
    }

    async deleteUser() {
        this.setState({ deleteConfirmation: false });
        await this.props.deleteUser(this.state.user);
        this.logout();
    }

    render() {
        return (
            <React.Fragment>
                <ViewController
                    title="Settings"
                    disableBack
                    navigation={this.props.navigation}
                    route={this.props.route}
                    leftActions={<Appbar.Action icon="close" onPress={this.props.navigation.goBack} />}
                >
                    <ScrollView style={{ padding: 16 }}>
                        <Card>
                            <Card.Content>
                                <Typography variant="overline">ACCOUNT</Typography>
                                <Typography variant="h5" style={{ marginTop: 4 }}>
                                    {this.props.user.name}
                                </Typography>
                                <Typography color="detail" style={{ marginTop: 4 }}>
                                    @{this.props.user.username}
                                </Typography>
                                <Typography color="detail" style={{ marginTop: 4 }}>
                                    {this.props.user.email}
                                </Typography>
                            </Card.Content>
                            <Card.Actions>
                                <Button labelStyle={typographyStyles.button} onPress={this.openUsernameChange}>
                                    Edit
                                </Button>
                                <View>
                                    <MobileLoginButton />
                                </View>
                                <View style={{ flex: 1 }} />
                                <Button
                                    color={Colors.red500}
                                    labelStyle={typographyStyles.button}
                                    onPress={this.openDeleteConfirmation}
                                >
                                    Delete
                                </Button>
                            </Card.Actions>
                        </Card>
                    </ScrollView>
                </ViewController>
                <Portal>
                    <Dialog visible={!!this.state.changeUserName} onDismiss={this.closeUsernameChange}>
                        <Dialog.Title>Edit account</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Username"
                                mode="flat"
                                error={!this.state.isUnique}
                                style={{ backgroundColor: 'none', paddingTop: 0, paddingHorizontal: 0 }}
                                value={this.state.newUsername}
                                onChangeText={this.handleChange.bind(this)}
                            />
                            {!this.state.isUnique && (
                                <Typography variant="caption" color="error" style={{ marginTop: 4 }}>
                                    This username is taken
                                </Typography>
                            )}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.closeUsernameChange} labelStyle={typographyStyles.button}>
                                Cancel
                            </Button>
                            <Button
                                labelStyle={typographyStyles.button}
                                onPress={this.checkUsernameUniqueness}
                                disabled={
                                    this.state.validatingUniqueness ||
                                    !this.state.isUnique ||
                                    this.state.newUsername === this.state.user.username
                                }
                            >
                                Save
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog
                        visible={!!this.state.deleteConfirmation}
                        onDismiss={this.hideDeleteConfirmation}
                        dismissable={false}
                    >
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
            </React.Fragment>
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
