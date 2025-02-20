import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';
import { PriorityDisplay } from '../shared/displays';
import { Checkbox } from '../shared/controls';
import BreadcrumbsLike from '../shared/breadcrumbs-like';
import { dateUtils } from 'packages/core';
import {
    getTasksSelectors,
    updateTask,
    deleteTask,
    updateTaskLocal,
    setShouldGoToTask,
} from 'packages/fe-shared/store/tasks';
import { getScheduleSelectors } from 'packages/fe-shared/store/schedule';
import { getAssignmentsSelectors } from 'packages/fe-shared/store/assignments';
import '../shared/list.scss';
import styles from './subtask-cell.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_DATETIME_FORMAT },
} = dateUtils;

class SubtaskCell extends React.Component {
    constructor(props) {
        super(props);

        this.deleteSelf = this.deleteSelf.bind(this);
        this.toggleCompletion = this.toggleCompletion.bind(this);
        this.openTask = this.openTask.bind(this);

        this.state = {
            task: this.props.selectTaskFromStore(this.props.tid),
        };
    }

    openTask() {
        this.props.setShouldGoToTask(this.props.tid);
        navigate('/tasks');
    }

    componentDidUpdate() {
        const storeTask = this.props.selectTaskFromStore(this.props.tid);

        if (!_.isEqual(storeTask, this.state.task)) {
            this.setState({ task: storeTask });
        }
    }

    deleteSelf() {
        this.props.deleteTask(this.state.task);
    }

    toggleCompletion() {
        this.handleChange('complete', !this.state.task.complete);
    }

    handleChange(prop, event) {
        const changes = {};

        changes[prop] = event.target.value;

        if (changes.complete) {
            changes.completionDate = dayjs().format(DB_DATETIME_FORMAT);
        }

        this.props.updateTaskLocal({
            id: this.props.tid,
            changes,
        });

        const afterUpdates = _.merge({}, this.state.task, changes);

        this.setState({
            task: afterUpdates,
        });

        this.props.updateTask(afterUpdates);
    }

    render() {
        const { task } = this.state;

        let taskIsOverdue = false;

        if (dateUtils.dueDateIsDate(task.dueDate)) {
            const dateValue = dayjs(this.state.task.dueDate, DB_DATE_FORMAT);
            taskIsOverdue = dateValue.isBefore(dayjs(), 'day');
        }

        const sections = [task.title, dateUtils.readableDueDate(this.state.task.dueDate)];

        if (!task.complete) {
            sections.push(<PriorityDisplay priority={_.get(this.state.task, 'priority')} />);
        }

        return (
            <div
                className={clsx({
                    'list-item': true,
                    [styles.subtaskCell]: true,
                    [styles.complete]: task.complete,
                })}
            >
                <Checkbox
                    checked={task.complete}
                    onChange={this.handleChange.bind(this, 'complete')}
                    className={styles.checkbox}
                />
                <BreadcrumbsLike
                    colors={['textPrimary', taskIsOverdue && !task.complete ? 'error' : 'textSecondary']}
                    sections={sections}
                />
                <div className="actions">
                    <IconButton className="action" size="small" onClick={this.openTask}>
                        <ChevronRight fontSize="inherit" />
                    </IconButton>
                    <IconButton className="action" size="small" onClick={this.deleteSelf}>
                        <DeleteIcon fontSize="inherit" color="error" />
                    </IconButton>
                </div>
            </div>
        );
    }
}

SubtaskCell.propTypes = {
    tid: PropTypes.string,
    updateTask: PropTypes.func,
    updateTaskLocal: PropTypes.func,
    deleteTask: PropTypes.func,
    selectTaskFromStore: PropTypes.func,
    setShouldGoToTask: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectTaskFromStore: getTasksSelectors(state.tasks).selectById,
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
        getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal, deleteTask, setShouldGoToTask };

export default connect(mapStateToProps, mapDispatchToProps)(SubtaskCell);
