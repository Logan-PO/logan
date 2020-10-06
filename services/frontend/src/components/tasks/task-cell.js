import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './task-cell.module.scss';

class TaskCell extends React.Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
    }

    select() {
        this.props.onSelect(this.props.task);
    }

    render() {
        return (
            <div
                className={classNames(style.taskCell, { [style.selected]: this.props.selected })}
                onClick={this.select}
            >
                <span>{this.props.task.title}</span>
            </div>
        );
    }
}

TaskCell.propTypes = {
    task: PropTypes.object,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
};

export default connect(null, null)(TaskCell);
