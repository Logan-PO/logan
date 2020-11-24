import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, SectionList } from 'react-native';
import { List, FAB, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import SegmentedControl from '@react-native-community/segmented-control';
import { getTasksSelectors, deleteTask, deleteTaskLocal } from '@logan/fe-shared/store/tasks';
import { getSections } from '@logan/fe-shared/sorting/tasks';
import theme from '../../globals/theme';
import TaskCell from '../../components/tasks/task-cell';
import ViewController from '../shared/view-controller';
import { typographyStyles } from '../shared/typography';

class TasksList extends React.Component {
    constructor(props) {
        super(props);

        this.openTask = this.openTask.bind(this);
        this.openDeleteConfirmation = this.openDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
        this.confirmDeletion = this.confirmDeletion.bind(this);

        this.state = {
            showingCompletedTasks: false,
            taskToDelete: undefined,
        };
    }

    openTask(tid) {
        this.props.navigation.push('Task', { tid });
    }

    openDeleteConfirmation(taskToDelete, callbacks) {
        this.setState({
            taskToDelete,
            deleteConfirmationCallbacks: callbacks,
        });
    }

    hideDeleteConfirmation() {
        this.state.deleteConfirmationCallbacks.deny();
        this.setState({ taskToDelete: undefined, deleteConfirmationCallbacks: undefined });
    }

    async confirmDeletion() {
        const callback = this.state.deleteConfirmationCallbacks.confirm;
        const taskToDelete = this.state.taskToDelete;
        this.setState({ taskToDelete: undefined, deleteConfirmationCallbacks: undefined });
        await callback();
        this.props.deleteTask(taskToDelete);
    }

    render() {
        const tasks = _.filter(this.props.tasks, task => task.complete === this.state.showingCompletedTasks);
        const sections = getSections(tasks, this.state.showingCompletedTasks);
        const listData = sections.map(([name, tids]) => ({ title: name, data: tids }));

        return (
            <ViewController
                title="Tasks"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActionIsFetch={true}
            >
                <View
                    style={{
                        padding: 12,
                        paddingTop: 0,
                        backgroundColor: theme.colors.primary,
                    }}
                >
                    <SegmentedControl
                        values={['Incomplete tasks', 'Completed tasks']}
                        selectedIndex={this.state.showingCompletedTasks ? 1 : 0}
                        onChange={event =>
                            this.setState({ showingCompletedTasks: !!event.nativeEvent.selectedSegmentIndex })
                        }
                        tintColor="white"
                    />
                </View>
                <SectionList
                    style={{ height: '100%', backgroundColor: 'white' }}
                    sections={listData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <TaskCell
                            key={item}
                            tid={item}
                            showOverdueLabel={!this.state.showingCompletedTasks}
                            onPress={() => this.openTask(item)}
                            onDeletePressed={this.openDeleteConfirmation}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <List.Subheader style={{ backgroundColor: 'white' }} key={title}>
                            {title}
                        </List.Subheader>
                    )}
                />
                <FAB
                    icon="plus"
                    color="white"
                    style={{
                        position: 'absolute',
                        margin: 16,
                        bottom: 0,
                        right: 0,
                    }}
                    onPress={() => this.props.navigation.navigate('New Task')}
                />
                <Portal>
                    <Dialog visible={!!this.state.taskToDelete} onDismiss={this.hideDeleteConfirmation}>
                        <Dialog.Title>Are you sure?</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{`You're about to delete a task.\nThis can't be undone.`}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.hideDeleteConfirmation} labelStyle={typographyStyles.button}>
                                Cancel
                            </Button>
                            <Button onPress={this.confirmDeletion} color="red" labelStyle={typographyStyles.button}>
                                Delete
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ViewController>
        );
    }
}

TasksList.propTypes = {
    tasks: PropTypes.array,
    fetchTasks: PropTypes.func,
    navigation: PropTypes.object,
    route: PropTypes.object,
    deleteTask: PropTypes.func,
};

const mapStateToProps = state => ({
    tasks: getTasksSelectors(state.tasks).selectAll(),
});

export default connect(mapStateToProps, { deleteTask, deleteTaskLocal })(TasksList);
