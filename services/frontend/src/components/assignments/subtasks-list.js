import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { List } from '@material-ui/core';
import TaskCell from '../tasks/task-cell';
import { getTasksSelectors, createTask, deleteTask } from '../../store/tasks';
import '../shared/list.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class SubtasksList extends React.Component {
    newTask() {
        return {
            aid: this.props.aid,
            title: 'New subtask',
            dueDate: dayjs().format(DB_DATE_FORMAT),
            priority: 0,
        };
    }

    render() {
        return (
            <div className="basic-list">
                <List>
                    {this.props.aid &&
                        this.props.tasks.map(task => <TaskCell key={task.tid} tid={task.tid} subtaskCell />)}
                </List>
            </div>
        );
    }
}

SubtasksList.propTypes = {
    aid: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state, ownProps) => {
    const selectors = getTasksSelectors(state.tasks);
    const allTasks = selectors.selectAll();

    return {
        tasks: _.filter(allTasks, task => task.aid === ownProps.aid),
    };
};

const mapDispatchToProps = { createTask, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(SubtasksList);
