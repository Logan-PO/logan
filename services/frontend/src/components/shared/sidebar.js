import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Drawer, Toolbar, List, ListItem, ListItemText, colors } from '@material-ui/core';
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
            <Drawer
                variant="permanent"
                className={styles.sidebar}
                PaperProps={{
                    style: {
                        background: colors.teal[700],
                        color: '#fff',
                    },
                }}
                classes={{ paper: styles.sidebarPaper }}
            >
                <Toolbar />
                <div className={styles.sidebarContainer}>
                    <List>
                        {Object.entries(pages).map(([name, url]) => {
                            const selected = this.props.currentPage === name;

                            return (
                                <ListItem button key={name} selected={selected} onClick={() => navigate(url)}>
                                    <ListItemText primary={selected ? <b>{name}</b> : name} />
                                </ListItem>
                            );
                        })}
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
