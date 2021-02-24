import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { Chip, Tooltip, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import TodayIcon from '@material-ui/icons/Today';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, updateTask, updateTaskLocal, setShouldGoToTask } from '@logan/fe-shared/store/tasks';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { colorForValue } from '../shared/displays/priority-constants';
import PriorityDisplay from '../shared/displays/priority-display';
import Checkbox from '../shared/controls/checkbox';
import Typography from '../shared/typography';
import styles from './task-cell.module.scss';

class TaskCell extends React.Component {
    constructor(props) {
        super(props);

        this.select = this.select.bind(this);
        this.deleted = this.deleted.bind(this);
        this.moveToToday = this.moveToToday.bind(this);
        this.moveToToday = this.moveToToday.bind(this);
        this.toggleCompletion = this.toggleCompletion.bind(this);
        this.openRelatedAssignment = this.openRelatedAssignment.bind(this);

        this.state = {
            task: this.props.selectTaskFromStore(this.props.tid),
        };
    }

    select() {
        if (this.props.onSelect) {
            this.props.onSelect(this.props.tid);
        }
    }

    deleted() {
        if (this.props.onDelete) {
            this.props.onDelete(this.state.task);
        }
    }

    openRelatedAssignment() {
        this.props.setShouldGoToTask(this.props.tid);
        navigate('/tasks');
    }

    componentDidUpdate() {
        const storeTask = this.props.selectTaskFromStore(this.props.tid);

        if (!_.isEqual(storeTask, this.state.task)) {
            this.setState({ task: storeTask });
        }
    }

    moveToToday() {
        this.handleChange('dueDate', dateUtils.formatAsDate(dateUtils.dayjs()));
    }

    toggleCompletion() {
        this.handleChange('complete', !this.state.task.complete);
    }

    handleChange(prop, newVal) {
        const changes = {};

        changes[prop] = newVal;

        if (changes.complete) {
            changes.completionDate = dateUtils.formatAsDateTime();
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
        const { selected, disableActions } = this.props;
        const { task = {} } = this.state;

        const selectedColor = colorForValue(task.priority);

        let shouldShowMoveToToday = false;

        if (this.props.onSelect && !task.complete && task.dueDate && dateUtils.dueDateIsDate(task.dueDate)) {
            shouldShowMoveToToday = dateUtils.toDate(task.dueDate).isBefore(dateUtils.dayjs(), 'day');
        }

        return (
            <div
                className={clsx('list-cell', styles.taskCell, this.props.className, selected && styles.selected)}
                style={{ background: selected ? `${selectedColor}4b` : undefined }}
                onClick={this.select}
            >
                <Checkbox
                    className={styles.checkbox}
                    cid={_.get(this.state.task, 'cid')}
                    checked={_.get(this.state, 'task.complete', false)}
                    onChange={this.toggleCompletion}
                />
                <div className={styles.taskContent}>
                    <Typography>{task.title}</Typography>
                    {task.description && (
                        <Typography variant="body2" color="textSecondary">
                            {task.description}
                        </Typography>
                    )}
                </div>
                <div className={styles.rightContent}>
                    {(task.tags || []).length > 0 && (
                        <div className={styles.tagsDisplay}>
                            {task.tags.map((tag, index) => (
                                <Chip className={styles.tag} color="secondary" size="small" key={index} label={tag} />
                            ))}
                        </div>
                    )}
                    {!disableActions && (
                        <div className={styles.actionsPriorityWrapper}>
                            <PriorityDisplay priority={task.priority} className={styles.priorityDisplay} />
                            <div className="actions">
                                {shouldShowMoveToToday && (
                                    <Tooltip title="Move to today" className={styles.action} onClick={this.moveToToday}>
                                        <IconButton size="small">
                                            <TodayIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {this.props.onDelete && (
                                    <Tooltip title="Delete">
                                        <IconButton size="small" className={styles.action} onClick={this.deleted}>
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

TaskCell.propTypes = {
    className: PropTypes.string,
    tid: PropTypes.string,
    showOverdueLabel: PropTypes.bool,
    updateTask: PropTypes.func,
    updateTaskLocal: PropTypes.func,
    selectTaskFromStore: PropTypes.func,
    getCourse: PropTypes.func,
    getAssignment: PropTypes.func,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
    setShouldGoToTask: PropTypes.func,
    disableActions: PropTypes.bool,
};

const mapStateToProps = state => {
    return {
        selectTaskFromStore: getTasksSelectors(state.tasks).selectById,
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
        getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal, setShouldGoToTask };

export default connect(mapStateToProps, mapDispatchToProps)(TaskCell);
