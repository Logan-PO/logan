import _ from 'lodash';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';
import { getCurrentTheme } from '../../../globals/theme';
import Typography from '../typography';
import styles from './text-button.module.scss';

/**
 * A simple text button, with an optional leading icon. Can be sized "small" or "large".
 */
const TextButton = ({ classes = {}, style, IconComponent, children, color = 'primary', size = 'small', ...rest }) => {
    if (!(size === 'large' || size === 'small')) {
        console.warn(`Invalid size '${size}' for TextButton. Defaulting to 'small'`);
        size = 'small';
    }

    const colorStyle = {};

    const theme = getCurrentTheme();

    if (_.get(theme.palette, [color, 'main'])) {
        colorStyle.color = theme.palette[color].main;
    } else if (color === 'white') {
        colorStyle.color = 'white';
    }

    const typographyVariant = size === 'large' ? 'body1' : 'body2';
    const typographyStyle = theme.typography[typographyVariant];

    return (
        <ButtonBase
            classes={{ root: clsx(styles.textButton, classes.root) }}
            style={{
                ...colorStyle,
                display: 'flex',
                alignItems: 'center',
                ...style,
            }}
            disableRipple
            {...rest}
        >
            {IconComponent && (
                <IconComponent
                    className={classes.icon}
                    style={{
                        display: 'inline !important',
                        marginBottom: 2,
                        marginRight: 4,
                        fontSize: `calc(${typographyStyle.fontSize} + 3px)`,
                    }}
                />
            )}
            <Typography className={classes.text} variant={typographyVariant} style={{ display: 'inline !important' }}>
                {children}
            </Typography>
        </ButtonBase>
    );
};

TextButton.propTypes = {
    classes: PropTypes.exact({
        root: PropTypes.string,
        icon: PropTypes.string,
        text: PropTypes.string,
    }),
    style: PropTypes.object,
    IconComponent: PropTypes.elementType,
    color: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.string,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

export default connect(mapStateToProps, undefined)(TextButton);
