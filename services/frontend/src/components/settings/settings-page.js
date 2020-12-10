import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Card, CardContent, CardActions, Typography, Button, colors } from '@material-ui/core';
import { setLoginStage } from '@logan/fe-shared/store/login';
import { Page } from '../shared';
import UsernameModal from './username-modal';
import DeleteModal from './delete-modal';
import LogOutModal from './logout-modal';

export class SettingsPage extends React.Component {
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
            <Page title="Settings">
                <Grid container style={{ padding: '1em' }}>
                    <Grid item>
                        <Card style={{ minWidth: 300 }}>
                            <CardContent style={{ paddingBottom: 0 }}>
                                <Typography variant="overline" style={{ lineHeight: '0.75rem' }}>
                                    Account
                                </Typography>
                                <Typography variant="h5" component="h2">
                                    {_.get(this.props, 'user.name')}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    @{_.get(this.props, 'user.username')}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {_.get(this.props, 'user.email')}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={this.openNewUsernameModal}>
                                    Edit
                                </Button>
                                <Button size="small" color="primary" onClick={this.openNewLogOutModal}>
                                    Logout
                                </Button>
                                <div style={{ flexGrow: 1 }} />
                                <Button
                                    size="small"
                                    style={{ color: colors.red[500] }}
                                    onClick={this.openNewDeleteModal}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
                <UsernameModal open={this.state.newUsernameModal} onClose={this.closeNewUsernameModal} />
                <LogOutModal open={this.state.newLogOutModal} onClose={this.closeNewLogOutModal} />
                <DeleteModal open={this.state.newDeleteModal} onClose={this.closeNewDeleteModal} />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
