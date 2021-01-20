import React from 'react';
import PropTypes from 'prop-types';
import { Typography as MuiTypography } from '@material-ui/core';
import { headingsFontFamily } from '../../globals/theme';

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
    'navbar-1': {
        fontSize: '24px',
        fontWeight: 500,
    },
    'navbar-2': {
        fontSize: '16px',
        fontWeight: 500,
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

const Typography = ({ useHeaderFont = false, children, style, variant, ...props }) => {
    const variantStyle = (variant && variants[variant]) || {};
    const customStyle = { display: 'flex', alignItems: 'center', ...variantStyle, ...style };
    const muiVariant = variant && variants[variant] ? undefined : variant;

    if (useHeaderFont) customStyle.fontFamily = headingsFontFamily;

    return (
        <MuiTypography variant={muiVariant} style={customStyle} {...props}>
            {children}
        </MuiTypography>
    );
};

Typography.propTypes = {
    useHeaderFont: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node,
    variant: PropTypes.string,
};

export { variants };
export default Typography;
