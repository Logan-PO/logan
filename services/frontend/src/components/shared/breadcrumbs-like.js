import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Typography from './typography';
import styles from './breadcrumbs-like.module.scss';

const BreadcrumbsLike = ({ variant = 'body1', colors = [], sections = [], classes = {}, separator, ...rest }) => {
    const children = [];

    for (let i = 0; i < sections.length; i++) {
        if (i > 0) {
            children.push(
                separator ? (
                    separator(colors[i], sections[i])
                ) : (
                    <Typography
                        className={classes.separator}
                        variant={variant}
                        color={colors[i]}
                        style={{ color: colors[i] }}
                    >
                        &nbsp;/&nbsp;
                    </Typography>
                )
            );
        }

        children.push(
            <Typography className={classes.section} variant={variant} color={colors[i]}>
                {sections[i]}
            </Typography>
        );
    }

    return (
        <div className={clsx(styles.breadcrumbsRoot, classes.root)} {...rest}>
            {children}
        </div>
    );
};

BreadcrumbsLike.propTypes = {
    classes: PropTypes.exact({
        root: PropTypes.string,
        separator: PropTypes.string,
        section: PropTypes.string,
    }),
    variant: PropTypes.string,
    colors: PropTypes.array,
    sections: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.node, PropTypes.string])),
    separator: PropTypes.func, // (colors[i], sections[i]) -> separator element
};

export default BreadcrumbsLike;
