import React from 'react';
import PropTypes from 'prop-types';
import styles from './page.module.scss';

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.page}>
                <div className={styles.navbar}>
                    <h2>Logan / {this.props.title}</h2>
                </div>
                <div className={styles.content}>{this.props.children}</div>
            </div>
        );
    }
}

Page.propTypes = {
    title: PropTypes.string,
    buttons: PropTypes.array,
    children: PropTypes.oneOf(PropTypes.array, PropTypes.object),
};

export default Page;
