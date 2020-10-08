import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import UpdateTimer from '../../utils/update-timer';
import { getTasksSelectors, updateTaskLocal, updateTask, deleteTask } from '../../store/tasks';
import styles from './task-editor.module.scss';

class TaskEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.updateTimer = new UpdateTimer(1000, () => this.props.updateTask(this.state.task));
        this.state = {
            task: undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            if (prevProps.tid) {
                this.updateTimer.fire();
                this.updateTimer.stop();
            }

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

        this.updateTimer.reset();
    }

    render() {
        const task = this.props.selectTask(this.props.tid);

        return (
            <div className={styles.taskEditor}>
                <div className={styles.row}>
                    <div className={styles.cell}>
                        <input
                            type="text"
                            className={styles.titleInput}
                            onChange={this.handleChange.bind(this, 'title')}
                            value={_.get(task, 'title', '')}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.cell}>
                        <textarea
                            className={styles.descriptionInput}
                            onChange={this.handleChange.bind(this, 'description')}
                            value={_.get(task, 'description', '')}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

TaskEditor.propTypes = {
    tid: PropTypes.string,
    tasks: PropTypes.object,
    updateTaskLocal: PropTypes.func,
    selectTask: PropTypes.func,
    updateTask: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectTask: getTasksSelectors(state.tasks).selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(TaskEditor);
