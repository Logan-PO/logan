import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, Typography, ListItemSecondaryAction, IconButton, Fab } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, updateTask, updateTaskLocal, setShouldGoToTask } from '@logan/fe-shared/store/tasks';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { CourseLabel, PriorityDisplay, TagsDisplay } from '../shared/displays';
import { Checkbox } from '../shared/controls';
import styles from './task-cell.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_DATETIME_FORMAT },
} = dateUtils;

class TaskCell extends React.Component {
    constructor(props) {
        super(props);

        this.select = this.select.bind(this);
        this.deleted = this.deleted.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openRelatedAssignment = this.openRelatedAssignment.bind(this);

        this.shouldShowOverdueLabel = this.shouldShowOverdueLabel.bind(this);
        this.overdueLabelContent = this.overdueLabelContent.bind(this);

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

    handleChange() {
        const changes = {
            complete: !this.state.task.complete,
        };

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

    shouldShowOverdueLabel() {
        if (!this.props.showOverdueLabel) return false;
        if (!dateUtils.dueDateIsDate(this.state.task.dueDate)) return false;

        const dateValue = dayjs(this.state.task.dueDate, DB_DATE_FORMAT);
        return dateValue.isBefore(dayjs(), 'day');
    }

    overdueLabelContent() {
        const dateValue = dayjs(this.state.task.dueDate, DB_DATE_FORMAT);
        const days = dayjs().diff(dateValue, 'days');

        if (days === 1) {
            return 'Due yesterday';
        } else {
            return `Due ${days} days ago`;
        }
    }

    render() {
        const assignment = this.props.getAssignment(_.get(this.state.task, 'aid'));
        const course = assignment
            ? this.props.getCourse(assignment.cid)
            : this.props.getCourse(_.get(this.state.task, 'cid'));

        const needsUpperLabel = !this.props.subtaskCell && (course || assignment);
        const hasBoth = course && assignment;

        return (
            <div className={`list-cell ${styles.taskCell}`}>
                <PriorityDisplay priority={_.get(this.state.task, 'priority')} />
                <ListItem button={!this.props.subtaskCell} selected={this.props.selected} onClick={this.select}>
                    <Checkbox
                        cid={_.get(this.state.task, 'cid')}
                        checked={_.get(this.state, 'task.complete', false)}
                        onChange={this.handleChange}
                        marginRight="1rem"
                    />
                    <ListItemText
                        primary={
                            <React.Fragment>
                                {needsUpperLabel && (
                                    <div className="cell-upper-label">
                                        {course && <CourseLabel cid={course.cid} />}
                                        {assignment && (
                                            <Typography className="assignment-label">
                                                {`${hasBoth ? ' / ' : ''}${assignment.title}`}
                                            </Typography>
                                        )}
                                    </div>
                                )}
                                <div>{_.get(this.state, 'task.title')}</div>
                                {_.get(this.state.task, 'tags', []).length > 0 && (
                                    <TagsDisplay tags={this.state.task.tags} />
                                )}
                                {this.shouldShowOverdueLabel() && (
                                    <Typography variant="body2" color="error">
                                        {this.overdueLabelContent()}
                                    </Typography>
                                )}
                            </React.Fragment>
                        }
                        secondary={_.get(this.state, 'task.description')}
                    />
                    <ListItemSecondaryAction className="actions">
                        {this.props.subtaskCell && (
                            <IconButton edge="end" onClick={this.openRelatedAssignment}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        )}
                        {this.props.onDelete ? (
                            <IconButton edge="end" onClick={this.deleted}>
                                <DeleteIcon color="error" />
                            </IconButton>
                        ) : null}
                        {this.props.specialActionsPadding && <Fab size="small" />}
                    </ListItemSecondaryAction>
                </ListItem>
            </div>
        );
    }
}

TaskCell.propTypes = {
    subtaskCell: PropTypes.bool,
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
    specialActionsPadding: PropTypes.bool,
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
