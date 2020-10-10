import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import { fetchTasks } from '../../store/tasks';
import styles from './navbar.module.scss';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.fetchAll = this.fetchAll.bind(this);
    }

    async fetchAll() {
        await this.props.fetchTasks();
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
};

const mapDispatchToProps = { fetchTasks };

export default connect(null, mapDispatchToProps)(Navbar);
