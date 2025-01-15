import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, colors } from '@material-ui/core';
import { Page } from '../shared';
import ColorPicker from '../shared/controls/color-picker';
import ListHeader from '../shared/list-header';
import ActionButton from '../shared/controls/action-button.js';
import InputGroup from '../shared/controls/input-group.js';
import Typography from '../shared/typography.js';
import UsernameModal from './username-modal';
import DeleteModal from './delete-modal';
import LogOutModal from './logout-modal';
import styles from './settings-page.module.scss';
import { handleClientLoad, handleAuthClick, handleSignoutClick } from 'packages/fe-shared/utils/google-classroom';
import { setLoginStage, updateUser } from 'packages/fe-shared/store/login';

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
                <div className={styles.settingsPage}>
                    <ListHeader title="Account" isBig />
                    <div>
                        <InputGroup
                            label="name"
                            content={<Typography variant="big-body">{_.get(this.props, 'user.name')}</Typography>}
                            style={{ paddingBottom: 10, paddingTop: 10 }}
                        />
                        <InputGroup
                            label="username"
                            content={<Typography>{_.get(this.props, 'user.username')}</Typography>}
                            style={{ paddingBottom: 10 }}
                        />
                        <InputGroup
                            label="email"
                            content={<Typography>{_.get(this.props, 'user.email')}</Typography>}
                            style={{ paddingBottom: 10 }}
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
                                color="primary"
                                disableElevation
                                onClick={handleClientLoad}
                            >
                                Google Classroom
                            </ActionButton>
                        </Grid>
                        <Grid item>
                            <ActionButton
                                id="authorize_button"
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={handleAuthClick}
                            >
                                Auth
                            </ActionButton>
                        </Grid>
                        <Grid item>
                            <ActionButton
                                id="signout_button"
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={handleSignoutClick}
                            >
                                Signout
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
