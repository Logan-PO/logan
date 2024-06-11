import _ from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typographyStyles } from './typography';

const VARIANTS = {
    DEFAULT: 'DEFAULT',
    LIST_BIG: 'LIST_BIG',
    LIST_NORMAL: 'LIST_NORMAL',
    LIST_SUBHEAD: 'LIST_SUBHEAD',
    LIST_SECHEAD: 'LIST_SECHEAD',
};

const variantStyles = {
    [VARIANTS.DEFAULT]: {
        inner: {
            fontFamily: 'Rubik500',
            textTransform: 'uppercase',
        },
    },
    [VARIANTS.LIST_NORMAL]: {
        outer: {
            paddingTop: 12,
            paddingBottom: 6,
        },
        inner: {
            paddingVertical: 0,
            color: 'black',
            fontFamily: 'Poppins500',
            fontSize: 26,
        },
    },
    [VARIANTS.LIST_BIG]: {
        outer: {
            paddingTop: 12,
            paddingBottom: 6,
        },
        inner: {
            paddingVertical: 0,
            color: 'black',
            fontFamily: 'Poppins500',
            fontSize: 34,
        },
    },
    [VARIANTS.LIST_SUBHEAD]: {
        inner: {
            paddingVertical: 0,
            fontFamily: 'Poppins600',
            fontSize: 18,
        },
    },
    [VARIANTS.LIST_SECHEAD]: {
        outer: {
            paddingTop: 4,
        },
        inner: {
            ...typographyStyles.body,
            paddingVertical: 0,
            fontFamily: 'Rubik500',
        },
    },
};

const styles = StyleSheet.create({
    safeWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: 'white',
    },
    subhead: {
        paddingBottom: 0,
        paddingRight: 4,
    },
    divider: {
        flex: 1,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

const ListHeader = ({ style, children, variant = VARIANTS.DEFAULT, ...rest }) => {
    const outerStyle = _.pick(style, ['backgroundColor']);
    const innerStyle = _.omit(style, ['backgroundColor']);

    return (
        <SafeAreaView
            style={{ ..._.get(variantStyles, [variant, 'outer']), ...styles.safeWrapper, ...outerStyle }}
            edges={['left', 'right']}
        >
            <List.Subheader
                style={{ ..._.get(variantStyles, [variant, 'inner']), ...styles.subhead, ...innerStyle }}
                {...rest}
            >
                {children}
            </List.Subheader>
            {[VARIANTS.LIST_NORMAL, VARIANTS.LIST_BIG].includes(variant) && <View style={styles.divider} />}
        </SafeAreaView>
    );
};

ListHeader.VARIANTS = VARIANTS;

ListHeader.propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
    variant: PropTypes.oneOf(Object.keys(VARIANTS)),
};

export default ListHeader;
