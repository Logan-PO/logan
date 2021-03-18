import React from 'react';
import PropTypes from 'prop-types';
import { Text, Colors } from 'react-native-paper';

const headingBase = {
    fontFamily: 'Poppins500',
};

const bodyBase = {
    fontFamily: 'Rubik400',
};

export const typographyStyles = {
    h1: {
        ...headingBase,
        fontWeight: '300',
        fontSize: 96,
    },
    h2: {
        ...headingBase,
        fontWeight: '300',
        fontSize: 60,
    },
    h3: {
        ...headingBase,
        fontSize: 48,
    },
    h4: {
        ...headingBase,
        fontSize: 34,
    },
    h5: {
        ...headingBase,
        fontSize: 24,
    },
    h6: {
        ...headingBase,
        fontWeight: '500',
        fontSize: 20,
    },
    subtitle1: {
        ...bodyBase,
        fontSize: 16,
    },
    subtitle2: {
        ...bodyBase,
        fontFamily: 'Rubik500',
        fontWeight: '500',
        fontSize: 14,
    },
    body: {
        ...bodyBase,
        fontSize: 16,
    },
    body2: {
        ...bodyBase,
        fontSize: 14,
        letterSpacing: 0,
    },
    button: {
        ...bodyBase,
        fontFamily: 'Rubik500',
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    caption: {
        ...bodyBase,
        fontSize: 12,
    },
    overline: {
        ...bodyBase,
        fontSize: 10,
        letterSpacing: 0.5,
    },
};

export const colorStyles = {
    primary: {
        color: 'black',
    },
    secondary: {
        color: Colors.grey500,
    },
    detail: {
        color: Colors.grey600,
    },
    error: {
        color: Colors.red500,
    },
};

const Typography = ({ variant = 'body', color = 'primary', style, children, ...rest }) => {
    const variantStyle = typographyStyles[variant];
    const colorStyle = color ? colorStyles[color] || { color } : colorStyles.primary;

    return (
        <Text {...rest} style={{ ...variantStyle, ...colorStyle, ...style }}>
            {children}
        </Text>
    );
};

Typography.propTypes = {
    style: PropTypes.object,
    variant: PropTypes.oneOf(Object.keys(typographyStyles)),
    color: PropTypes.string,
    children: PropTypes.node,
};

export default Typography;
