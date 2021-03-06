import React from 'react';
import PropTypes from 'prop-types';
import { Typography as MuiTypography } from '@material-ui/core';
import { headingsFontFamily } from '../../globals/theme';

const BUILTIN_COLORS = ['initial', 'inherit', 'primary', 'secondary', 'textPrimary', 'textSecondary', 'error'];

const variants = {
    title: {
        fontFamily: headingsFontFamily,
        fontSize: '72px',
        lineHeight: '1em',
    },
    subtitle: {
        fontSize: '36px',
        lineHeight: '1.2em',
    },
    'big-body': {
        fontSize: '18px',
    },
    'navbar-1': {
        fontSize: '24px',
        fontWeight: 500,
    },
    'navbar-2': {
        fontSize: '16px',
        fontWeight: 500,
    },
    'list-heading': {
        fontFamily: headingsFontFamily,
        fontSize: '14px',
        fontWeight: 600,
    },
    'list-heading-big': {
        fontFamily: headingsFontFamily,
        fontSize: '18px',
        fontWeight: 600,
    },
    'list-header-detail': {
        fontFamily: headingsFontFamily,
        fontSize: '16px',
    },
    detail: {
        fontSize: '11.5px',
    },
    'detail-label': {
        fontSize: '11.5px',
        textTransform: 'uppercase',
        color: '#646464',
    },
    'big-input': {
        fontSize: '24px',
    },
};

const Typography = ({ useHeaderFont = false, children, color, style, variant, ...rest }) => {
    const variantStyle = (variant && variants[variant]) || {};
    const customStyle = { display: 'flex', alignItems: 'center', userSelect: 'none', ...variantStyle, ...style };
    const muiVariant = variant && variants[variant] ? undefined : variant;

    if (useHeaderFont) customStyle.fontFamily = headingsFontFamily;

    if (color && !BUILTIN_COLORS.includes(color)) {
        customStyle.color = customStyle.color || color;
        color = undefined;
    }

    return (
        <MuiTypography color={color} variant={muiVariant} style={customStyle} {...rest}>
            {children}
        </MuiTypography>
    );
};

Typography.propTypes = {
    color: PropTypes.string,
    useHeaderFont: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node,
    variant: PropTypes.string,
};

export { variants };
export default Typography;
