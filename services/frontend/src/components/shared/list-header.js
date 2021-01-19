import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Typography from './typography';
import styles from './list-header.module.scss';

const ListHeader = ({ title, detail, isBig = false, color, className, ...rest }) => {
    return (
        <div className={clsx(styles.listHeader, className)} {...rest}>
            <Typography color={color} className={styles.title} variant={isBig ? 'h1' : 'h2'}>
                {title}
            </Typography>
            <div className={styles.horizontalLine} />
            {detail && (
                <Typography color={color} className={styles.detail} variant="list-header-detail">
                    {detail}
                </Typography>
            )}
        </div>
    );
};

ListHeader.propTypes = {
    title: PropTypes.string.isRequired,
    detail: PropTypes.string,
    isBig: PropTypes.boolean,
    color: PropTypes.string,
    className: PropTypes.string,
};

export default ListHeader;
