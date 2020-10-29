import React from 'react';
import styles from './404.module.scss';

export default class ErrorPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.errorPage}>
                <h1 className={styles.number}>404</h1>
                <h2 className={styles.found}>Page not Found</h2>
                <p className={styles.last}>
                    The page you are looking for might have been removed or is temporarily unavailable.
                </p>
            </div>
        );
    }
}
