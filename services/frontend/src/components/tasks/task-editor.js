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

        this.changesExist = false;
        this.updateTimer = new UpdateTimer(1000, () => {
            this.props.updateTask(this.state.task);
            this.changesExist = false;
        });

        this.state = {
            task: undefined,
        };
    }

    componentDidUpdate(prevProps) {
        // If the user has selected a new task and updates to the existing task haven't been saved yet, save them
        if (this.props.tid !== prevProps.tid) {
            if (prevProps.tid && this.changesExist) {
                const prevTask = this.props.selectTask(prevProps.tid);

                if (prevTask) this.updateTimer.fire();

                this.updateTimer.stop();
            }

            this.setState({
                task: this.props.selectTask(this.props.tid),
            });
        }
    }

    handleChange(prop, e) {
        this.changesExist = true;

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
        return (
            <div className={styles.taskEditor}>
                <div className={styles.row}>
                    <div className={styles.cell}>
                        <input
                            type="text"
                            className={styles.titleInput}
                            onChange={this.handleChange.bind(this, 'title')}
                            value={_.get(this.state.task, 'title', '')}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.cell}>
                        <textarea
                            className={styles.descriptionInput}
                            onChange={this.handleChange.bind(this, 'description')}
                            value={_.get(this.state.task, 'description', '')}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

TaskEditor.propTypes = {
    tid: PropTypes.string,
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
