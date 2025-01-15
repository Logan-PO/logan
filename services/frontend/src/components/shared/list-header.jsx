import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from './typography';
import styles from './list-header.module.scss';

const ListHeader = ({ title, detail, isBig = false, color = 'textPrimary', disableDivider, className, ...rest }) => {
    return (
        <ListSubheader classes={{ root: clsx(styles.listHeader, className) }} disableGutters {...rest}>
            <Typography color={color} className={styles.title} variant={isBig ? 'h1' : 'h2'}>
                {title}
            </Typography>
            {!disableDivider && <div className={styles.horizontalLine} />}
            {detail && (
                <Typography color={color} className={styles.detail} variant="list-header-detail">
                    {detail}
                </Typography>
            )}
        </ListSubheader>
    );
};

ListHeader.propTypes = {
    title: PropTypes.string.isRequired,
    detail: PropTypes.string,
    isBig: PropTypes.bool,
    disableDivider: PropTypes.bool,
    color: PropTypes.string,
    className: PropTypes.string,
};

export default ListHeader;
