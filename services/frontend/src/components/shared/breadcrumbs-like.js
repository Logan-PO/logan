import React from 'react';
import PropTypes from 'prop-types';
import Typography from './typography';
import styles from './breadcrumbs-like.module.scss';

const BreadcrumbsLike = ({ variant = 'body1', colors = [], sections = [], ...rest }) => {
    const children = [];

    for (let i = 0; i < sections.length; i++) {
        if (i > 0) {
            children.push(
                <Typography variant={variant} color={colors[i]}>
                    &nbsp;/&nbsp;
                </Typography>
            );
        }

        children.push(
            <Typography variant={variant} color={colors[i]}>
                {sections[i]}
            </Typography>
        );
    }

    return (
        <div className={styles.breadcrumbsRoot} {...rest}>
            {children}
        </div>
    );
};

BreadcrumbsLike.propTypes = {
    variant: PropTypes.string,
    colors: PropTypes.array,
    sections: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.node, PropTypes.string])),
};

export default BreadcrumbsLike;
