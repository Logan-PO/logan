import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import { fetchTasks } from '../../store/tasks';
import { fetchSchedule } from '../../store/schedule';
import styles from './navbar.module.scss';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.fetchAll = this.fetchAll.bind(this);
    }

    componentDidMount() {
        this.fetchAll();
    }

    async fetchAll() {
        const fetchers = [this.props.fetchTasks(), this.props.fetchSchedule()];
        await Promise.all(fetchers);
    }

    render() {
        return (
            <AppBar className={styles.navbar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Logan &gt; {this.props.title}
                    </Typography>
                    <div className={styles.flexibleSpace} />
                    {this.props.buttons}
                    <IconButton onClick={this.fetchAll} color="inherit">
                        <SyncIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    title: PropTypes.string,
    buttons: PropTypes.array,
    fetchTasks: PropTypes.func,
    fetchSchedule: PropTypes.func,
};

const mapDispatchToProps = { fetchTasks, fetchSchedule };

export default connect(null, mapDispatchToProps)(Navbar);
