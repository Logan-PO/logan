import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getTasksSelectors, updateTask, updateTaskLocal } from '../../store/tasks';
import style from './task-cell.module.scss';

class TaskCell extends React.Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            task: this.props.selectTaskFromStore(this.props.tid),
        };
    }

    select() {
        this.props.onSelect(this.props.tid);
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            this.setState({
                task: this.props.selectTaskFromStore(this.props.tid),
            });
        }
    }

    handleChange() {
        const changes = {
            complete: !this.state.task.complete,
        };

        this.props.updateTaskLocal({
            id: this.props.tid,
            changes,
        });

        this.setState({
            task: _.merge({}, this.state.task, changes),
        });
    }

    render() {
        return (
            <div
                className={classNames(style.taskCell, { [style.selected]: this.props.selected })}
                onClick={this.select}
            >
                <input type="checkbox" value={_.get(this.state, 'task.complete', false)} onChange={this.handleChange} />
                <span>{_.get(this.state, 'task.title')}</span>
                {!_.isEmpty(_.get(this.state, 'task.description')) && (
                    <React.Fragment>
                        <br />
                        <span style={{ color: 'gray' }}>{this.state.task.description}</span>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

TaskCell.propTypes = {
    tid: PropTypes.string,
    updateTaskLocal: PropTypes.func,
    selectTaskFromStore: PropTypes.func,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectTaskFromStore: getTasksSelectors(state.tasks).selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal };

export default connect(mapStateToProps, mapDispatchToProps)(TaskCell);
