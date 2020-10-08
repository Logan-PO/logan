import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import makeSelectors from '../../utils/selectors-helper';
import { adapter, updateTaskLocal, updateTask, deleteTask } from '../../store/tasks';
import styles from './task-editor.module.scss';

class TaskEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            task: undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            this.setState({
                task: this.props.selectTask(this.props.tid),
            });
        }
    }

    handleChange(prop, e) {
        const changes = {};

        changes[prop] = e.target.value;

        this.props.updateTaskLocal({
            id: this.props.tid,
            changes,
        });

        this.setState({
            task: _.merge({}, this.state.task, changes),
        });
    }

    render() {
        const task = this.props.selectTask(this.props.tid);

        return (
            <div className={styles.taskEditor}>
                <input type="text" onChange={this.handleChange.bind(this, 'title')} value={_.get(task, 'title', '')} />
            </div>
        );
    }
}

TaskEditor.propTypes = {
    tid: PropTypes.string,
    tasks: PropTypes.object,
    updateTaskLocal: PropTypes.func,
    selectTask: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = makeSelectors(adapter, state.tasks);

    return {
        selectTask: selectors.selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(TaskEditor);
