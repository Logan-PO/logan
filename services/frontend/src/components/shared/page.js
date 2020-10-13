import React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from '@material-ui/core';
import styles from './page.module.scss';
import { Navbar, Sidebar } from '.';

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.page}>
                <Navbar title={this.props.title} buttons={this.props.buttons} />
                <div className={styles.rootContainer}>
                    <Toolbar />
                    <div className={styles.contentContainer}>
                        <Sidebar currentPage={this.props.title} />
                        <div className={styles.content}>{this.props.children}</div>
                    </div>
                </div>
            </div>
        );
    }
}

Page.propTypes = {
    title: PropTypes.string,
    buttons: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default Page;
