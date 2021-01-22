import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { getTasksSelectors, createTask, deleteTask } from '@logan/fe-shared/store/tasks';
import TaskCell from '../tasks/task-cell';
import ListItem from '../shared/list-item';
import Typography from '../shared/typography';

class SubtasksList extends React.Component {
    constructor(props) {
        super(props);

        this.openTask = this.openTask.bind(this);
    }

    openTask(tid) {
        this.props.navigation.push('Task', { tid });
    }

    listContent() {
        if (this.props.aid && this.props.tasks.length) {
            return this.props.tasks.map((task, index) => (
                <React.Fragment key={task.tid}>
                    <TaskCell key={task.tid} tid={task.tid} subTask={true} onPress={() => this.openTask(task.tid)} />
                    {index < this.props.tasks.length - 1}
                </React.Fragment>
            ));
        } else {
            return (
                <ListItem
                    leftContent={
                        <Typography color="secondary" style={{ fontStyle: 'italic' }}>
                            None
                        </Typography>
                    }
                />
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                <View>{this.listContent()}</View>
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
