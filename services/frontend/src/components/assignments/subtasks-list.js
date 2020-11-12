import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { Paper, List, Divider } from '@material-ui/core';
import { getTasksSelectors, createTask, deleteTask } from '@logan/fe-shared/store/tasks';
import TaskCell from '../tasks/task-cell';
import '../shared/list.scss';
import './subtasks-list.scss';

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
        if (!this.props.tasks.length) {
            return <div />;
        }

        return (
            <Paper variant="outlined" className="subtasks-list">
                <div className="basic-list">
                    <List>
                        {this.props.aid &&
                            this.props.tasks.map((task, index) => (
                                <React.Fragment key={task.tid}>
                                    <TaskCell key={task.tid} tid={task.tid} subtaskCell />
                                    {index < this.props.tasks.length - 1 && (
                                        <Divider component="li" style={{ marginTop: -1 }} />
                                    )}
                                </React.Fragment>
                            ))}
                    </List>
                </div>
            </Paper>
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
