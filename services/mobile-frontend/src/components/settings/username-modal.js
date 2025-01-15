import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { setLoginStage, fetchSelf } from 'packages/fe-shared/store/login';
import { updateUser } from 'packages/fe-shared/store/settings';

class UsernameModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.updateUser = this.updateUser.bind(this);

        this.state = {
            user: {
                uid: _.get(this.props, 'user.uid'),
                name: _.get(this.props, 'user.name'),
                email: _.get(this.props, 'user.email'),
                username: 'empty',
            },
        };
    }

    close() {
        this.props.onClose();
    }

    async updateUser() {
        await this.props.updateUser(this.state.user);
        this.props.fetchSelf();
        this.props.onClose();
    }

    handleChange(prop, e) {
        const user = this.state.user;
        user[prop] = e.target.value;
        this.setState({ user });
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="sm">
                <Dialog.Content>
                    <TextInput label="New Username" fullWidth onChange={this.handleChange.bind(this, 'username')} />
                </Dialog.Content>
                <Dialog.Actions>
                    <View>
                        <Button variant="contained" color="primary" disableElevation onClick={this.updateUser}>
                            Change
                        </Button>
                    </View>
                </Dialog.Actions>
            </Dialog>
        );
    }
}

UsernameModal.propTypes = {
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
    setLoginStage,
    updateUser,
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsernameModal);
