import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@material-ui/core';
import './tags-display.scss';

class TagsDisplay extends React.Component {
    render() {
        return (
            <div>
                {this.props.tags.map((tag, index) => (
                    <Chip
                        className="tag-display-tag"
                        size="small"
                        key={index}
                        label={tag}
                        style={{ margin: '0 4px 6px 0' }}
                    />
                ))}
            </div>
        );
    }
}

TagsDisplay.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
};

TagsDisplay.defaultProps = {
    tags: [],
};

export default TagsDisplay;
