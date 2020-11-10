import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { fetchTasks } from '../../store/tasks';
import { fetchAssignments } from '../../store/assignments';
import { fetchSchedule } from '../../store/schedule';
import { fetchReminders } from '../../store/reminders';
import styles from './navbar.module.scss';
import AccountDialog from './account-dialog';

class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.openAccountModal = this.openAccountModal.bind(this);
        this.accountModalClosed = this.accountModalClosed.bind(this);

        this.state = {
            accountModalOpen: false,
        };
    }

    componentDidMount() {
        this.fetchAll();
    }

    async fetchAll() {
        const fetchers = [
            this.props.fetchTasks(),
            this.props.fetchAssignments(),
            this.props.fetchSchedule(),
            this.props.fetchReminders(),
        ];
        await Promise.all(fetchers);
    }

    openAccountModal() {
        this.setState({ accountModalOpen: true });
    }

    accountModalClosed() {
        this.setState({ accountModalOpen: false });
    }

    render() {
        return (
            <AppBar className={styles.navbar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Logan &gt; <b>{this.props.title}</b>
                    </Typography>
                    <div className={styles.flexibleSpace} />
                    {this.props.buttons}
                    <IconButton onClick={this.fetchAll} color="inherit">
                        <SyncIcon />
                    </IconButton>
                    <IconButton onClick={this.openAccountModal} color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
                <AccountDialog open={this.state.accountModalOpen} onClose={this.accountModalClosed} />
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    title: PropTypes.string,
    buttons: PropTypes.array,
    fetchTasks: PropTypes.func,
    fetchAssignments: PropTypes.func,
    fetchSchedule: PropTypes.func,
    fetchReminders: PropTypes.func,
};

const mapDispatchToProps = { fetchTasks, fetchAssignments, fetchSchedule, fetchReminders };

export default connect(null, mapDispatchToProps)(Navbar);
