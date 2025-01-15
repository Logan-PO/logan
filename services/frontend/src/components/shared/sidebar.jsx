import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';
import { Tooltip, IconButton } from '@material-ui/core';
import { Home, Assignment, CollectionsBookmark, Settings } from '@material-ui/icons';
import { CheckboxMarkedCircleOutline } from 'mdi-material-ui';
import styles from './sidebar.module.scss';

const pages = {
    Overview: {
        url: '/overview',
        icon: Home,
    },
    Tasks: {
        url: '/tasks',
        icon: CheckboxMarkedCircleOutline,
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
                        <div key={name} className={buttonClass}>
                            <Tooltip
                                title={name}
                                disableHoverListener={selected}
                                disableFocusListener={selected}
                                disableTouchListener={selected}
                            >
                                <span>
                                    <IconButton disabled={selected} onClick={() => navigate(url)}>
                                        <IconComponent className={styles.sidebarButtonIcon} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </div>
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
