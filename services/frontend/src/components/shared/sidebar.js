import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Drawer, Toolbar, List, ListItem, ListItemText } from '@material-ui/core';
import styles from './sidebar.module.scss';

const pages = {
    Overview: '/overview',
    Tasks: '/tasks',
    Assignments: '/assignments',
    Schedule: '/schedule',
    Settings: '/settings',
};

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
                        {Object.entries(pages).map(([name, url]) => (
                            <ListItem
                                button
                                key={name}
                                selected={this.props.currentPage === name}
                                onClick={() => navigate(url)}
                            >
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
