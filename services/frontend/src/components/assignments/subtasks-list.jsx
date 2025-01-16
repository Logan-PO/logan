import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import TasksIcon from 'mdi-material-ui/CheckboxMarkedCircleOutline';
import TaskModal from '../tasks/task-modal';
import InputGroup from '../shared/controls/input-group';
import TextButton from '../shared/controls/text-button';
import '../shared/list.scss';
import SubtaskCell from './subtask-cell';
import styles from './subtasks-list.module.scss';
import { getTasksSelectors, createTask, deleteTask } from 'packages/fe-shared/store/tasks';
import { dateUtils } from 'packages/core';

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
            return (
                <div className={`${styles.subtasksList} small-list`}>
                    {this.props.tasks.map(task => (
                        <SubtaskCell key={task.tid} tid={task.tid} subtaskCell />
                    ))}
                </div>
            );
        } else {
            return undefined;
        }
    }

    render() {
        return (
            <React.Fragment>
                <InputGroup
                    classes={{ accessoryCell: this.props.tasks.length && styles.accessoryCellAlignTop }}
                    label="Subtasks"
                    icon={TasksIcon}
                    content={
                        <div className={styles.subtasksListRoot}>
                            {this.listContent()}
                            <TextButton size="large" IconComponent={AddIcon} onClick={this.openNewTaskModal}>
                                Add subtask
                            </TextButton>
                        </div>
                    }
                />
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
