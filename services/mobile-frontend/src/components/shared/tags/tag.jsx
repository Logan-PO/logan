import _ from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from '../typography';

const Tag = ({ text, children, onPress, variant = 'caption', color = Colors.grey300, onDelete, style, ...rest }) => {
    const [height, setHeight] = useState('auto');
    const [deleteHeight, setDeleteHeight] = useState('auto');

    const onLayout = ({ nativeEvent }) => {
        setHeight(nativeEvent.layout.height);
    };

    const onDeleteLayout = ({ nativeEvent }) => {
        setDeleteHeight(nativeEvent.layout.height);
    };

    const borderRadius = typeof height === 'number' ? height / 2 : 50;
    const deleteBorderRadius = typeof deleteHeight === 'number' ? deleteHeight / 2 : 10;

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                onLayout={onLayout}
                style={{
                    height: height,
                    minWidth: height,
                    borderRadius,
                    paddingVertical: 3,
                    paddingHorizontal: 7,
                    backgroundColor: color,
                    marginRight: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    ...style,
                }}
                {...rest}
            >
                {!_.isEmpty(text) && <Typography variant={variant}>{text}</Typography>}
                {children}
                {onDelete && (
                    <TouchableWithoutFeedback onPress={onDelete}>
                        <View
                            style={{
                                backgroundColor: Colors.grey400,
                                borderRadius: deleteBorderRadius,
                                marginVertical: -4,
                                marginLeft: 3,
                                marginRight: -3,
                                padding: 2,
                            }}
                            onLayout={onDeleteLayout}
                        >
                            <Icon name="close" size={12} />
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

Tag.propTypes = {
    style: PropTypes.object,
    variant: PropTypes.string,
    text: PropTypes.string,
    color: PropTypes.string,
    onPress: PropTypes.func,
    onDelete: PropTypes.func,
    children: PropTypes.node,
};

export default Tag;
