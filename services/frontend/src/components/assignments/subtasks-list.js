import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, createTask, deleteTask } from '@logan/fe-shared/store/tasks';
import { Paper, List, Divider, FormLabel, Fab, ListItem, ListItemText } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TaskCell from '../tasks/task-cell';
import '../shared/list.scss';
import TaskModal from '../tasks/task-modal';
import classes from './subtasks-list.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class SubtasksList extends React.Component {
    constructor(props) {
        super(props);

        this.openNewTaskModal = this.openNewTaskModal.bind(this);
        this.closeNewTaskModal = this.closeNewTaskModal.bind(this);

        this.state = {
            newTaskModalOpen: false,
        };
    }

    openNewTaskModal() {
        this.setState({ newTaskModalOpen: true });
    }

    closeNewTaskModal() {
        this.setState({ newTaskModalOpen: false });
    }

    newTask() {
        return {
            aid: this.props.aid,
            title: 'New subtask',
            dueDate: dayjs().format(DB_DATE_FORMAT),
            priority: 0,
        };
    }

    listContent() {
        if (this.props.aid && this.props.tasks.length) {
            return this.props.tasks.map((task, index) => (
                <React.Fragment key={task.tid}>
                    <TaskCell key={task.tid} tid={task.tid} subtaskCell />
                    {index < this.props.tasks.length - 1 && <Divider component="li" style={{ marginTop: -1 }} />}
                </React.Fragment>
            ));
        } else {
            return (
                <ListItem>
                    <ListItemText secondary="No subtasks" />
                </ListItem>
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <FormLabel
                        style={{
                            fontSize: '0.75rem',
                            marginBottom: '0.5rem',
                            display: 'inline-block',
                        }}
                    >
                        Subtasks
                    </FormLabel>
                    <Paper variant="outlined" className="subtasks-list">
                        <div className="basic-list">
                            <List>{this.listContent()}</List>
                        </div>
                    </Paper>
                    <div className={classes.fabContainer}>
                        <Fab color="secondary" size="small" className={classes.fab} onClick={this.openNewTaskModal}>
                            <AddIcon fontSize="small" />
                        </Fab>
                    </div>
                </div>
                <TaskModal open={this.state.newTaskModalOpen} onClose={this.closeNewTaskModal} aid={this.props.aid} />
            </React.Fragment>
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
