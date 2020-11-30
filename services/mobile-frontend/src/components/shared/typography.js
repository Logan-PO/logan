import React from 'react';
import PropTypes from 'prop-types';
import { Text, Colors } from 'react-native-paper';

export const typographyStyles = {
    h1: {
        fontWeight: '300',
        fontSize: 96,
    },
    h2: {
        fontWeight: '300',
        fontSize: 60,
    },
    h3: {
        fontSize: 48,
    },
    h4: {
        fontSize: 34,
    },
    h5: {
        fontSize: 24,
    },
    h6: {
        fontWeight: '500',
        fontSize: 20,
    },
    subtitle1: {
        fontSize: 16,
    },
    subtitle2: {
        fontWeight: '500',
        fontSize: 14,
    },
    body: {
        fontSize: 16,
    },
    body2: {
        fontSize: 14,
        letterSpacing: 0,
    },
    button: {
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    caption: {
        fontSize: 12,
    },
    overline: {
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
        <Text {...rest} style={{ ...style, ...variantStyle, ...colorStyle }}>
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
