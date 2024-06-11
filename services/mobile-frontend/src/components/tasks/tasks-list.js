import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, SectionList } from 'react-native';
import { FAB, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import SegmentedControl from '@react-native-community/segmented-control';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, deleteTask, deleteTaskLocal } from '@logan/fe-shared/store/tasks';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import { getSections } from '@logan/fe-shared/sorting/tasks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentTheme } from '../../globals/theme';
import TaskCell from '../../components/tasks/task-cell';
import ViewController from '../shared/view-controller';
import { typographyStyles } from '../shared/typography';
import ListHeader from '../shared/list-header';
import ListSubheader from '../shared/list-subheader';

const styles = StyleSheet.create({
    breadcrumbsSection: {
        fontFamily: 'Rubik500',
    },
});

class TasksList extends React.Component {
    constructor(props) {
        super(props);

        this.openTask = this.openTask.bind(this);
        this.openDeleteConfirmation = this.openDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
        this.confirmDeletion = this.confirmDeletion.bind(this);
        this.renderItem = this.renderItem.bind(this);

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

    renderItem({ item }) {
        if (typeof item === 'string') {
            return (
                <TaskCell
                    key={item}
                    tid={item}
                    showOverdueLabel={!this.state.showingCompletedTasks}
                    onPress={() => this.openTask(item)}
                    onDeletePressed={this.openDeleteConfirmation}
                />
            );
        } else {
            const { aid, cid } = item;
            const sortKey = `${cid || ''} ${aid || ''}`;

            const colors = [];
            const items = [];

            const course = this.props.getCourse(cid);
            const assignment = this.props.getAssignment(aid);

            if (course) {
                colors.push(course.color);
                items.push(!_.isEmpty(course.nickname) ? course.nickname : course.title);
            }

            if (assignment) {
                items.push(assignment.title);
            }

            return (
                <ListSubheader
                    breadcrumbsStyles={{ section: styles.breadcrumbsSection }}
                    key={sortKey}
                    colors={colors}
                    items={items}
                />
            );
        }
    }

    render() {
        const theme = getCurrentTheme();

        const tasks = _.filter(this.props.tasks, task => task.complete === this.state.showingCompletedTasks);
        const sections = getSections(tasks, this.state.showingCompletedTasks, this.props.getAssignment);
        const listData = sections.map(([name, groups]) => ({
            title: name,
            data: _.flatMap(groups, group => {
                if (group.meta.cid || group.meta.aid) {
                    return [
                        {
                            type: 'subheader',
                            ...group.meta,
                        },
                        ...group.tids,
                    ];
                } else {
                    return group.tids;
                }
            }),
        }));

        return (
            <ViewController
                title="Tasks"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActionIsFetch={true}
                rightActionIsSetting={true}
            >
                <SafeAreaView
                    edges={['left', 'right']}
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
                </SafeAreaView>
                <SectionList
                    style={{ height: '100%', backgroundColor: 'white' }}
                    sections={listData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={this.renderItem}
                    renderSectionHeader={({ section: { title } }) => {
                        const formattedTitle = dateUtils.dueDateIsDate(title)
                            ? dateUtils.readableDueDate(title, { includeWeekday: true })
                            : title;

                        const isToday = formattedTitle === 'Today';
                        const variant = isToday ? ListHeader.VARIANTS.LIST_BIG : ListHeader.VARIANTS.LIST_NORMAL;

                        return (
                            <ListHeader variant={variant} key={title}>
                                {formattedTitle}
                            </ListHeader>
                        );
                    }}
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
    getAssignment: PropTypes.func,
    getCourse: PropTypes.func,
};

const mapStateToProps = state => ({
    tasks: getTasksSelectors(state.tasks).selectAll(),
    getAssignment: getAssignmentsSelectors(state.assignments).selectById,
    getCourse: getCourseSelectors(state.schedule).selectById,
});

export default connect(mapStateToProps, { deleteTask, deleteTaskLocal })(TasksList);
