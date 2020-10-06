import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import style from './task-cell.module.scss';

class TaskCell extends React.Component {
    render() {
        return (
            <div className={style.taskCell}>
                <span>{this.props.task.title}</span>
            </div>
        );
    }
}

TaskCell.propTypes = {
    task: PropTypes.object,
};

export default connect(null, null)(TaskCell);
