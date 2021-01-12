import React from 'react';
import PropTypes from 'prop-types';
import { Typography as MuiTypography } from '@material-ui/core';

const variants = {
    'navbar-1': {
        fontFamily: 'Poppins',
        fontSize: '24px',
        fontWeight: 500,
    },
    'navbar-2': {
        fontFamily: 'Poppins',
        fontSize: '16px',
        fontWeight: 500,
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
