import _ from 'lodash';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import priorities from './priority-constants';
import styles from './priority-display.module.scss';

const PriorityDisplay = ({ priority, className, ...rest }) => {
    const p = _.defaultTo(
        _.find(_.values(priorities), ([num]) => num === priority),
        ['white', 'white']
    );

    const dotCount = priority + 3;
    const dots = [];

    for (let i = 0; i < dotCount; i++) {
        dots.push(<div className={styles.dot} key={i} />);
    }

    return (
        <div className={clsx(styles.priorityDisplay, className)} style={{ color: p[1] }} {...rest}>
            {dots}
        </div>
    );
};

PriorityDisplay.propTypes = {
    priority: PropTypes.number,
    className: PropTypes.string,
};

export default PriorityDisplay;
