import React from 'react';
import PropTypes from 'prop-types';
import { Typography as MuiTypography } from '@material-ui/core';
import { headingsFontFamily } from '../../globals/theme';

const variants = {
    'navbar-1': {
        fontSize: '24px',
        fontWeight: 500,
    },
    'navbar-2': {
        fontSize: '16px',
        fontWeight: 500,
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

export { variants };
export default Typography;
