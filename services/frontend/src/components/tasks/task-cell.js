import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    ListItem,
    ListItemText,
    Typography,
    ListItemIcon,
    ListItemSecondaryAction,
    IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { getTasksSelectors, updateTask, updateTaskLocal } from '../../store/tasks';
import { getScheduleSelectors } from '../../store/schedule';
import { getAssignmentsSelectors } from '../../store/assignments';
import { CourseLabel } from '../shared';
import { Checkbox } from '../shared/controls';
import globalStyles from '../../globals/global.scss';
import styles from './task-cell.module.scss';

class TaskCell extends React.Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.deleted = this.deleted.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            task: this.props.selectTaskFromStore(this.props.tid),
        };
    }

    select() {
        this.props.onSelect(this.props.tid);
    }

    deleted() {
        this.props.onDelete(this.state.task);
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

        this.props.updateTaskLocal({
            id: this.props.tid,
            changes,
        });

        this.setState({
            task: _.merge({}, this.state.task, changes),
        });
    }

    render() {
        const assignment = this.props.getAssignment(_.get(this.state.task, 'aid'));
        const course = assignment
            ? this.props.getCourse(assignment.cid)
            : this.props.getCourse(_.get(this.state.task, 'cid'));

        const needsUpperLabel = course || assignment;
        const hasBoth = course && assignment;

        return (
            <div className={styles.taskCell}>
                <ListItem button selected={this.props.selected} onClick={this.select}>
                    <ListItemIcon>
                        <Checkbox
                            cid={_.get(this.state.task, 'cid')}
                            checked={_.get(this.state, 'task.complete', false)}
                            onChange={this.handleChange}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <React.Fragment>
                                {needsUpperLabel && (
                                    <div className={globalStyles.cellUpperLabel}>
                                        {course && <CourseLabel cid={course.cid} />}
                                        {assignment && (
                                            <Typography className={globalStyles.assignmentLabel}>
                                                {(hasBoth && '/') + assignment.title}
                                            </Typography>
                                        )}
                                    </div>
                                )}
                                <div>{_.get(this.state, 'task.title')}</div>
                            </React.Fragment>
                        }
                        secondary={_.get(this.state, 'task.description')}
                    />
                    <ListItemSecondaryAction className={styles.actions}>
                        <IconButton edge="end" onClick={this.deleted}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </div>
        );
    }
}

TaskCell.propTypes = {
    tid: PropTypes.string,
    updateTaskLocal: PropTypes.func,
    selectTaskFromStore: PropTypes.func,
    getCourse: PropTypes.func,
    getAssignment: PropTypes.func,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectTaskFromStore: getTasksSelectors(state.tasks).selectById,
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
        getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal };

export default connect(mapStateToProps, mapDispatchToProps)(TaskCell);
