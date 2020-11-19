import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { beginFetching, finishFetching } from '@logan/fe-shared/store/fetch-status';
import { fetchTasks } from '@logan/fe-shared/store/tasks';
import { fetchAssignments } from '@logan/fe-shared/store/assignments';
import { fetchSchedule } from '@logan/fe-shared/store/schedule';
import { fetchReminders } from '@logan/fe-shared/store/reminders';
import UpdateTimer from '@logan/fe-shared/utils/update-timer';
import { dateUtils } from '@logan/core';
import styles from './navbar.module.scss';
import AccountDialog from './account-dialog';

const FETCH_INTERVAL = 10;

class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.fetchAll = this.fetchAll.bind(this);
        this.openAccountModal = this.openAccountModal.bind(this);
        this.accountModalClosed = this.accountModalClosed.bind(this);

        this.timer = new UpdateTimer(FETCH_INTERVAL * 1000, this.updateTimerCallback.bind(this));

        this.state = {
            accountModalOpen: false,
        };
    }

    componentDidMount() {
        if (!this.props.lastFetch) {
            this.timer.fire();
        } else {
            const lastFetchDate = dateUtils.toDateTime(this.props.lastFetch);
            const now = dateUtils.dayjs();

            if (lastFetchDate.isSameOrBefore(now.subtract(FETCH_INTERVAL, 'second'))) {
                this.timer.fire();
            }
        }
    }

    async updateTimerCallback() {
        if (this.props.fetchIsBlocked) {
            this.timer.procrastinate(100);
            return;
        }

        await this.fetchAll();

        this.timer.reset();
    }

    async fetchAll() {
        if (!this.props.canFetch) {
            console.debug('Cannot fetch');
            return;
        }

        console.debug('Fetching');

        this.props.beginFetching();

        const fetchers = [
            this.props.fetchTasks(),
            this.props.fetchAssignments(),
            this.props.fetchSchedule(),
            this.props.fetchReminders(),
        ];

        await Promise.all(fetchers);

        this.props.finishFetching();
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
                    <Tooltip title="Refresh">
                        <span>
                            <IconButton disabled={!this.props.canFetch} onClick={this.fetchAll} color="inherit">
                                <SyncIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
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
    beginFetching: PropTypes.func,
    finishFetching: PropTypes.func,
    isFetching: PropTypes.bool,
    fetchIsBlocked: PropTypes.bool,
    canFetch: PropTypes.bool,
    lastFetch: PropTypes.string,
};

const mapStateToProps = state => {
    const isFetching = state.fetchStatus.fetching;
    const fetchIsBlocked = state.fetchStatus.blocked;
    const canFetch = !isFetching && !fetchIsBlocked;

    return {
        isFetching,
        fetchIsBlocked,
        canFetch,
        lastFetch: state.fetchStatus.lastFetch,
    };
};

const mapDispatchToProps = {
    fetchTasks,
    fetchAssignments,
    fetchSchedule,
    fetchReminders,
    beginFetching,
    finishFetching,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
