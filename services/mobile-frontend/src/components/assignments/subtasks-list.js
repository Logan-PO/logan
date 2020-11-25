import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, createTask, deleteTask } from '@logan/fe-shared/store/tasks';
import { List, FAB, Text } from 'react-native-paper';
import TaskCell from '../tasks/task-cell';
import TaskModal from '../tasks/new-task-modal';
import ListItem from '../shared/list-item';
import { typographyStyles } from '../shared/typography';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class SubtasksList extends React.Component {
    constructor(props) {
        super(props);

        this.openNewTaskModal = this.openNewTaskModal.bind(this);
        this.closeNewTaskModal = this.closeNewTaskModal.bind(this);
        this.createSubTask = this.createSubTask.bind(this);

        this.state = {
            newTaskModalOpen: false,
        };
    }
    createSubTask() {
        this.props.navigation.push('Subtask', this.newTask());
        this.props.navigation.navigate('New Task');
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
        //TODO:do task cells have this prop?
        if (this.props.aid && this.props.tasks.length) {
            return this.props.tasks.map((task, index) => (
                <React.Fragment key={task.tid}>
                    <TaskCell key={task.tid} tid={task.tid} subtaskCell />
                    {index < this.props.tasks.length - 1}
                </React.Fragment>
            ));
        } else {
            return (
                <ListItem>
                    <Text
                        style={{
                            ...typographyStyles.body,
                        }}
                    >
                        No Subtasks
                    </Text>
                </ListItem>
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <div className="basic-list">
                        <List style={{ padding: 0 }}>{this.listContent()}</List>
                    </div>
                    <FAB
                        icon="plus"
                        color="white"
                        style={{
                            position: 'absolute',
                            margin: 16,
                            bottom: 0,
                            right: 0,
                        }}
                        onPress={() => this.createSubTask()}
                    />
                </div>
                <TaskModal open={this.state.newTaskModalOpen} onClose={this.closeNewTaskModal} />
            </React.Fragment>
        );
    }
}

SubtasksList.propTypes = {
    aid: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.object),
    route: PropTypes.object,
    navigation: PropTypes.object,
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
