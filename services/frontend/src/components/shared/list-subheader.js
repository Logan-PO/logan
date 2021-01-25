import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import styles from './list-subheader.module.scss';
import BreadcrumbsLike from './breadcrumbs-like';
import Typography from './typography';

// eslint-disable-next-line no-unused-vars
const ListSubheader = ({ items = [], colors = [], isBig = false, className, showHorizontalDivider, ...rest }) => (
    <div className={clsx(styles.root, className)}>
        <BreadcrumbsLike
            classes={{ root: styles.listHeader }}
            variant={isBig ? undefined : 'list-heading'}
            sections={items}
            colors={colors}
            separator={color => (
                <Typography color={color} className={styles.chevron}>
                    <ChevronRightIcon style={{ color: 'inherit', fontSize: '1.2rem' }} />
                </Typography>
            )}
        />
        {showHorizontalDivider && <div className={styles.horizontalLine} />}
    </div>
);

ListSubheader.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    isBig: PropTypes.bool,
    className: PropTypes.string,
    showHorizontalDivider: PropTypes.bool,
};

export default ListSubheader;
