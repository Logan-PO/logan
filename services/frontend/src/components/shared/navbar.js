import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
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
