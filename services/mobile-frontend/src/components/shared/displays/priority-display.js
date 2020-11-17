import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import priorities from '../priority-constants';

class PriorityDisplay extends React.Component {
    render() {
        const p = _.defaultTo(
            _.find(_.values(priorities), ([num]) => num === this.props.priority),
            ['white', 'white']
        );
        const style = {
            width: 4,
            height: '100%',
            backgroundColor: p[1],
        };
        return <View style={style} />;
    }
}

PriorityDisplay.propTypes = {
    priority: PropTypes.number,
};

export default PriorityDisplay;
