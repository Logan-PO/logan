import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, useWindowDimensions } from 'react-native';

const FullImage = ({ source, width, height, horizontalPadding }) => {
    const windowWidth = useWindowDimensions().width;
    const aspect = height / width;
    const scaledWidth = windowWidth - 2 * (horizontalPadding || 0);
    const scaledHeight = scaledWidth * aspect;
    console.log(aspect);

    return (
        <View style={{ width: scaledWidth, height: scaledHeight }}>
            <Image style={{ width: scaledWidth, height: scaledHeight }} source={source} />
        </View>
    );
};

FullImage.propTypes = {
    source: PropTypes.any,
    width: PropTypes.number,
    height: PropTypes.number,
    horizontalPadding: PropTypes.number,
};

export default FullImage;
