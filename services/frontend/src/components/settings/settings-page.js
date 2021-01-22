import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Grid, colors } from '@material-ui/core';
import { setLoginStage, updateUser } from '@logan/fe-shared/store/login';
import { Page } from '../shared';
import ColorPicker from '../shared/controls/color-picker';
import ListHeader from '../shared/list-header';
import ActionButton from '../shared/controls/action-button.js';
import InputGroup from '../shared/controls/input-group.js';
import UsernameModal from './username-modal';
import DeleteModal from './delete-modal';
import LogOutModal from './logout-modal';

export class SettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleUserChange = this.handleUserChange.bind(this);

        this.openNewUsernameModal = this.openNewUsernameModal.bind(this);
        this.closeNewUsernameModal = this.closeNewUsernameModal.bind(this);
        this.openNewDeleteModal = this.openNewDeleteModal.bind(this);
        this.closeNewDeleteModal = this.closeNewDeleteModal.bind(this);
        this.openNewLogOutModal = this.openNewLogOutModal.bind(this);
        this.closeNewLogOutModal = this.closeNewLogOutModal.bind(this);

        this.state = {
            user: props.user,
            newUsernameModal: false,
            newDeleteModal: false,
            newLogOutModal: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.user, prevProps.user)) {
            this.setState({ user: this.props.user });
        }
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

    handleUserChange(prop, event) {
        const changes = {};

        if (prop === 'primaryColor' || prop === 'accentColor') {
            let colorName;

            for (let [color, values] of Object.entries(colors)) {
                if (values[500] === event.target.value) {
                    colorName = color;
                    break;
                }
            }

            if (colorName) {
                changes[prop] = colorName;
            } else {
                console.warn(`Unrecognized color: ${event.target.value}`);
            }
        }

        const updatedUser = _.merge({}, this.state.user, changes);

        this.setState({ user: updatedUser });

        this.props.updateUser(updatedUser);
    }

    render() {
        const primary = colors[_.get(this.state, 'user.primaryColor', 'teal')][500];
        const accent = colors[_.get(this.state, 'user.accentColor', 'deepOrange')][500];

        return (
            <Page title="Settings">
                <div style={{ background: 'white', minHeight: '100%' }}>
                    <Container style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                        <ListHeader title="Account" isBig />
                        <div>
                            <InputGroup
                                label="NAME"
                                content={_.get(this.props, 'user.name')}
                                style={{ fontSize: 16, paddingBottom: 10, paddingTop: 10 }}
                            />
                            <InputGroup
                                label="USERNAME"
                                content={_.get(this.props, 'user.username')}
                                style={{ fontSize: 16, paddingBottom: 10 }}
                            />
                            <InputGroup
                                label="EMAIL"
                                content={_.get(this.props, 'user.email')}
                                style={{ fontSize: 16, paddingBottom: 10 }}
                            />
                        </div>
                        <Grid container spacing={1} style={{ paddingTop: '1em' }}>
                            <Grid item>
                                <ActionButton
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    onClick={this.openNewUsernameModal}
                                >
                                    Edit account
                                </ActionButton>
                            </Grid>
                            <Grid item>
                                <ActionButton
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    onClick={this.openNewLogOutModal}
                                >
                                    Log out
                                </ActionButton>
                            </Grid>
                            <Grid item>
                                <ActionButton
                                    variant="contained"
                                    color="error"
                                    disableElevation
                                    onClick={this.openNewDeleteModal}
                                >
                                    Delete account
                                </ActionButton>
                            </Grid>
                        </Grid>
                        {/* Modals */}
                        <UsernameModal open={this.state.newUsernameModal} onClose={this.closeNewUsernameModal} />
                        <LogOutModal open={this.state.newLogOutModal} onClose={this.closeNewLogOutModal} />
                        <DeleteModal open={this.state.newDeleteModal} onClose={this.closeNewDeleteModal} />
                        <ListHeader title="Theme" isBig style={{ paddingTop: 20 }} />
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <div style={{ display: 'inline-block', minWidth: '12rem', paddingTop: 10 }}>
                                    <ColorPicker
                                        label="PRIMARY COLOR"
                                        size="medium"
                                        fullWidth
                                        disableNone
                                        primaryOnly
                                        value={primary}
                                        onChange={this.handleUserChange.bind(this, 'primaryColor')}
                                    />
                                </div>
                            </Grid>
                            <Grid item>
                                <div style={{ display: 'inline-block', minWidth: '12rem' }}>
                                    <ColorPicker
                                        label="ACCENT COLOR"
                                        size="medium"
                                        fullWidth
                                        disableNone
                                        value={accent}
                                        onChange={this.handleUserChange.bind(this, 'accentColor')}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
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
    updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
