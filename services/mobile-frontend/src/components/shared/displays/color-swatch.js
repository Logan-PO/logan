import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const ColorSwatch = ({ color, radius = 5 }) => (
    <View
        style={{
            backgroundColor: color,
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
        }}
    />
);

ColorSwatch.propTypes = {
    color: PropTypes.string,
    radius: PropTypes.number,
};

export default ColorSwatch;
