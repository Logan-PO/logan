import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';
import { Button } from '@material-ui/core';
import { Home, CheckCircleOutline, Assignment, CollectionsBookmark, Settings } from '@material-ui/icons';
import styles from './sidebar.module.scss';
import Typography from './typography';

const pages = {
    Overview: {
        url: '/overview',
        icon: Home,
    },
    Tasks: {
        url: '/tasks',
        icon: CheckCircleOutline,
    },
    Assignments: {
        url: '/assignments',
        icon: Assignment,
    },
    Schedule: {
        url: '/schedule',
        icon: CollectionsBookmark,
    },
    Settings: {
        url: '/settings',
        icon: Settings,
    },
};

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.sidebar}>
                {Object.entries(pages).map(([name, { url, icon }]) => {
                    const IconComponent = icon;
                    const selected = this.props.currentPage === name;
                    const buttonClass = selected ? styles.sidebarButtonSelected : styles.sidebarButton;

                    return (
                        <Button
                            key={name}
                            onClick={() => navigate(url)}
                            classes={{ root: buttonClass, label: styles.buttonLabel }}
                        >
                            <IconComponent />
                            {selected && (
                                <Typography variant="caption" className={styles.buttonTitle}>
                                    {name}
                                </Typography>
                            )}
                        </Button>
                    );
                })}
            </div>
        );
    }
}

Sidebar.propTypes = {
    currentPage: PropTypes.string,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

export default connect(mapStateToProps, undefined)(Sidebar);
