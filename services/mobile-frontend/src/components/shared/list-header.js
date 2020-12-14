import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListHeader = ({ style, children, ...rest }) => {
    const outerStyle = _.pick(style, ['backgroundColor']);
    const innerStyle = _.omit(style, ['backgroundColor']);

    return (
        <SafeAreaView style={outerStyle} edges={['left', 'right']}>
            <List.Subheader style={innerStyle} {...rest}>
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
