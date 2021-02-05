import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import styles from './list-subheader.module.scss';
import BreadcrumbsLike from './breadcrumbs-like';
import Typography from './typography';

const ListSubheader = ({ items = [], colors = [], isBig = false, classes = {}, showHorizontalDivider }) => (
    <div className={clsx(styles.root, classes.root)}>
        <BreadcrumbsLike
            classes={{ root: clsx(styles.listHeader, classes.breadcrumbs) }}
            variant={isBig ? 'list-heading-big' : 'list-heading'}
            sections={items}
            colors={colors}
            separator={color => (
                <Typography color={color} className={clsx(styles.chevron, classes.chevron)}>
                    <ChevronRightIcon style={{ color: 'inherit', fontSize: '1.2rem' }} />
                </Typography>
            )}
        />
        {showHorizontalDivider && <div className={clsx(styles.horizontalLine, classes.divider)} />}
    </div>
);

ListSubheader.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    isBig: PropTypes.bool,
    classes: PropTypes.exact({
        root: PropTypes.string,
        breadcrumbs: PropTypes.string,
        chevron: PropTypes.string,
        divider: PropTypes.string,
    }),
    showHorizontalDivider: PropTypes.bool,
};

export default ListSubheader;
