import React from 'react';
import PropTypes from 'prop-types';
import { Typography as MuiTypography } from '@material-ui/core';

const variants = {
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
};

const Typography = ({ children, style, variant, ...props }) => {
    const variantStyle = (variant && variants[variant]) || {};
    const customStyle = { ...variantStyle, ...style };
    const muiVariant = variant && variants[variant] ? undefined : variant;

    return (
        <MuiTypography variant={muiVariant} style={customStyle} {...props}>
            {children}
        </MuiTypography>
    );
};

Typography.propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
    variant: PropTypes.string,
};

export default Typography;
