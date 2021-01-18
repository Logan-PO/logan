import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import priorities from './priority-constants';
import styles from './priority-display.module.scss';

class PriorityDisplay extends React.Component {
    render() {
        const p = _.defaultTo(
            _.find(_.values(priorities), ([num]) => num === this.props.priority),
            ['white', 'white']
        );

        const dotCount = this.props.priority + 3;
        const dots = [];

        for (let i = 0; i < dotCount; i++) {
            dots.push(<div className={styles.dot} key={i} />);
        }

        return (
            <div className={styles.priorityDisplay} style={{ color: p[1] }}>
                {dots}
            </div>
        );
    }
}

PriorityDisplay.propTypes = {
    priority: PropTypes.number,
};

export default PriorityDisplay;
