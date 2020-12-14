import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { View } from 'react-native';

function customGet(object, propertiesToTry) {
    for (const prop of propertiesToTry) {
        const val = _.get(object, prop);
        if (val !== undefined) return val;
    }

    return 0;
}

const FullWidthSafeAreaView = ({ style, children, ...rest }) => {
    const originalLeftPadding = customGet(style, ['paddingLeft', 'paddingHorizontal', 'padding']);
    const originalRightPadding = customGet(style, ['paddingRight', 'paddingHorizontal', 'padding']);
    const originalLeftMargin = customGet(style, ['marginLeft', 'marginHorizontal', 'margin']);
    const originalRightMargin = customGet(style, ['marginRight', 'marginHorizontal', 'margin']);

    return (
        <SafeAreaInsetsContext.Consumer>
            {insets => {
                const updatedStyle = _.merge({}, style || {}, {
                    marginLeft: originalLeftMargin - insets.left,
                    marginRight: originalRightMargin - insets.right,
                    paddingLeft: originalLeftPadding + insets.left,
                    paddingRight: originalRightPadding + insets.right,
                });

                return (
                    <View style={updatedStyle} {...rest}>
                        {children}
                    </View>
                );
            }}
        </SafeAreaInsetsContext.Consumer>
    );
};

FullWidthSafeAreaView.propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
};

export default FullWidthSafeAreaView;
