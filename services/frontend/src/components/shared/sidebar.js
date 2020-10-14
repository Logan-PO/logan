import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, Toolbar, List, ListItem, ListItemText } from '@material-ui/core';
import styles from './sidebar.module.scss';

const pages = ['Overview', 'Tasks', 'Assignments', 'Schedule', 'Settings'];

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Drawer variant="permanent" className={styles.sidebar} classes={{ paper: styles.sidebarPaper }}>
                <Toolbar />
                <div className={styles.sidebarContainer}>
                    <List>
                        {pages.map(name => (
                            <ListItem button key={name} selected={this.props.currentPage === name}>
                                <ListItemText primary={name} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        );
    }
}

Sidebar.propTypes = {
    currentPage: PropTypes.string,
};

export default Sidebar;
