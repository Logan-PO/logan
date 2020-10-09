import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import styles from './navbar.module.scss';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
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
                    <IconButton color="inherit">
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
};

export default Navbar;
