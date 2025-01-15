import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Tag from './tag';

const TagsDisplay = ({ tags, style }) => (
    <View style={{ flexDirection: 'row', ...style }}>
        {tags.map((tag, i) => (
            <Tag key={i} text={tag} />
        ))}
    </View>
);

TagsDisplay.propTypes = {
    tags: PropTypes.array,
    style: PropTypes.object,
};

export default TagsDisplay;
