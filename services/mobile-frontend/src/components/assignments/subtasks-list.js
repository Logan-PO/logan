import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, createTask, deleteTask } from '@logan/fe-shared/store/tasks';
import { FAB, Text } from 'react-native-paper';
import TaskCell from '../tasks/task-cell';
import ListItem from '../shared/list-item';
import { typographyStyles } from '../shared/typography';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class SubtasksList extends React.Component {
    constructor(props) {
        super(props);

        this.createSubTask = this.createSubTask.bind(this);
    }
    createSubTask() {
        let tempTask = this.newTask();
        this.props.route.push('Subtask', tempTask);
        this.props.navigation.navigate('New Task');
    }

    newTask() {
        return {
            aid: this.props.route.params.aid,
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
                <View>
                    <View>{this.listContent()}</View>
                    <FAB
                        icon="plus"
                        color="white"
                        style={{
                            position: 'absolute',
                            margin: 16,
                            bottom: 0,
                            right: 0,
                        }}
                        onPress={this.createSubTask()}
                    />
                </View>
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
