import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import priorities from './priority-constants';
import styles from './priority-display.module.scss';

class PriorityDisplay extends React.Component {
    render() {
        const p = _.find(_.values(priorities), ([num]) => num === this.props.priority);
        const style = { background: p[1] };
        return <div className={styles.priorityDisplay} style={style} />;
    }
}

PriorityDisplay.propTypes = {
    priority: PropTypes.number,
};

export default PriorityDisplay;
