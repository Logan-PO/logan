import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Typography from './typography';

const ss = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
});

const BreadcrumbsLike = ({ variant = 'body', colors = [], sections = [], styles = {}, separator, ...rest }) => {
    const children = [];

    for (let i = 0; i < sections.length; i++) {
        // Render separators
        if (i > 0) {
            children.push(
                separator ? (
                    separator(colors[i], sections[i], i)
                ) : (
                    <Typography
                        key={`s${i}`}
                        variant={variant}
                        color={colors[i]}
                        style={{ color: colors[i], ...styles.separator }}
                    >
                        {' / '}
                    </Typography>
                )
            );
        }

        children.push(
            <Typography key={i} variant={variant} color={colors[i]} style={{ color: colors[i], ...styles.section }}>
                {sections[i]}
            </Typography>
        );
    }

    return (
        <View style={{ ...ss.root, ...styles.root }} {...rest}>
            {children}
        </View>
    );
};

BreadcrumbsLike.propTypes = {
    variant: PropTypes.string,
    styles: PropTypes.exact({
        root: PropTypes.object,
        separator: PropTypes.object,
        section: PropTypes.object,
    }),
    colors: PropTypes.array,
    sections: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.node, PropTypes.string])),
    separator: PropTypes.func, // (colors[i], sections[i], i) -> separator element
};

export default BreadcrumbsLike;
