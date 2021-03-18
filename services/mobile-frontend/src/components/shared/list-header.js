import _ from 'lodash';
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
    subhead: {
        color: 'black',
        fontSize: 24,
        fontFamily: 'Poppins_500Medium',
        paddingBottom: 4,
    },
});

const ListHeader = ({ style, children, ...rest }) => {
    const outerStyle = _.pick(style, ['backgroundColor']);
    const innerStyle = _.omit(style, ['backgroundColor']);

    return (
        <SafeAreaView style={outerStyle} edges={['left', 'right']}>
            <List.Subheader style={{ ...styles.subhead, ...innerStyle }} {...rest}>
                {children}
            </List.Subheader>
        </SafeAreaView>
    );
};

ListHeader.propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
};

export default ListHeader;
