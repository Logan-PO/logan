import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from '@logan/core';
import { fetchAssignments, getAssignmentsSelectors, deleteAssignment } from '@logan/fe-shared/store/assignments';
import { fetchTasks, getTasksSelectors, deleteTask } from '@logan/fe-shared/store/tasks';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import { View, SectionList } from 'react-native';
import { Button, Dialog, FAB, Paragraph, Portal } from 'react-native-paper';
import AssignmentCell from '../assignments/assignment-cell';
import TaskCell from '../tasks/task-cell';
import ViewController from '../shared/view-controller';
import { typographyStyles } from '../shared/typography';
import ListHeader from '../shared/list-header';
import OverviewSectionCell from './overview-section-cell';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

export class OverviewList extends React.Component {
    constructor(props) {
        super(props);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.renderListSection = this.renderListSection.bind(this);
        this.getRelevantData = this.getRelevantData.bind(this);
        this.changeCondense = this.changeCondense.bind(this);
        this.changeView = this.changeView.bind(this);

        this.state = {
            listView: true,
            fabOpen: false,
        };
    }

    openModal({ message, confirm }) {
        this.setState({
            modalShown: true,
            modalMessage: message,
            modalConfirmation: () => {
                confirm && confirm();
                this.closeModal();
            },
        });
    }

    closeModal() {
        this.setState({
            modalShown: false,
            modalMessage: undefined,
            modalConfirmation: undefined,
        });
    }

    getRelevantData() {
        const groups = [];

        const allAssignments = this.props.assignmentSelectors.selectAll();
        const allTasks = this.props.taskSelectors.selectAll();
        const allSections = this.props.scheduleSelectors.baseSelectors.sections.selectAll();

        function sectionsForDate(date) {
            const sections = [];

            for (const section of allSections) {
                const start = dayjs(section.startDate, DB_DATE_FORMAT);
                const end = dayjs(section.endDate, DB_DATE_FORMAT);

                if (!date.isBetween(start, end, 'day', '[]')) continue;

                const weeksSinceStart = date.diff(start, 'week');
                if (weeksSinceStart % section.weeklyRepeat !== 0) continue;
                if (!section.daysOfWeek.includes(date.weekday())) continue;

                sections.push(section);
            }

            return _.sortBy(sections, section => dayjs(section.startTime, DB_TIME_FORMAT));
        }

        function filterByDate(arr, date) {
            return _.filter(
                arr,
                el => dateUtils.dueDateIsDate(el.dueDate) && dayjs(el.dueDate, DB_DATE_FORMAT).isSame(date, 'day')
            );
        }

        let runner = dayjs();
        let end = dayjs().add(7, 'days');

        while (runner.isSameOrBefore(end, 'day')) {
            const sections = sectionsForDate(runner);
            const assignments = filterByDate(allAssignments, runner);
            const tasks = _.reject(filterByDate(allTasks, runner), 'complete');

            if (!_.isEmpty(sections) || !_.isEmpty(assignments) || !_.isEmpty(tasks)) {
                groups.push([runner, { sections, assignments, tasks }]);
            }

            runner = runner.add(1, 'day');
        }

        return groups.map(([date, data]) => ({
            title: dateUtils.humanReadableDate(date),
            data: [data],
        }));
    }

    changeCondense() {
        this.setState({
            condensed: !_.get(this.state, 'condensed', false),
            listView: _.get(this.state, 'listView', true),
        });
    }

    changeView() {
        this.setState({
            condensed: _.get(this.state, 'condensed', false),
            listView: !_.get(this.state, 'listView', true),
        });
    }

    secondaryHeader(title) {
        return <ListHeader variant={ListHeader.VARIANTS.LIST_SUBHEAD}>{title}</ListHeader>;
    }

    renderListSection({ sections, assignments, tasks }) {
        return (
            <React.Fragment>
                {sections.length > 0 && (
                    <React.Fragment>
                        {this.secondaryHeader('Schedule')}
                        <View style={{ paddingVertical: 4 }}>
                            {sections.map(({ sid }) => (
                                <OverviewSectionCell key={sid} sid={sid} />
                            ))}
                        </View>
                    </React.Fragment>
                )}
                {assignments.length > 0 && (
                    <React.Fragment>
                        {this.secondaryHeader('Assignments')}
                        {assignments.map(assignment => (
                            <AssignmentCell
                                key={assignment.aid}
                                aid={assignment.aid}
                                onPress={() => this.props.navigation.push('Assignment', _.pick(assignment, 'aid'))}
                                onDeletePressed={() =>
                                    this.openModal({
                                        message: 'You are about to delete an assignment.\nThis cannot be undone.',
                                        confirm: () => this.props.deleteAssignment(assignment),
                                    })
                                }
                            />
                        ))}
                    </React.Fragment>
                )}
                {tasks.length > 0 && (
                    <React.Fragment>
                        {this.secondaryHeader('Tasks')}
                        {tasks.map(task => (
                            <TaskCell
                                key={task.tid}
                                tid={task.tid}
                                onPress={() => this.props.navigation.push('Task', _.pick(task, 'tid'))}
                                onDeletePressed={() =>
                                    this.openModal({
                                        message: 'You are about to delete a task.\nThis cannot be undone.',
                                        confirm: () => this.props.deleteTask(task),
                                    })
                                }
                            />
                        ))}
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }

    render() {
        const groups = this.getRelevantData();

        return (
            <React.Fragment>
                <ViewController
                    title="Overview"
                    navigation={this.props.navigation}
                    route={this.props.route}
                    disableBack
                    leftActionIsFetch={true}
                    rightActionIsSetting={true}
                >
                    <SectionList
                        style={{ height: '100%', backgroundColor: 'white' }}
                        sections={groups}
                        keyExtractor={(item, index) => item + index}
                        renderSectionHeader={({ section: { title } }) => {
                            const variant =
                                title === 'Today' ? ListHeader.VARIANTS.LIST_BIG : ListHeader.VARIANTS.LIST_NORMAL;

                            return (
                                <ListHeader variant={variant} key={title}>
                                    {title}
                                </ListHeader>
                            );
                        }}
                        renderItem={({ item }) => this.renderListSection(item)}
                    />
                    <Portal>
                        <Dialog visible={this.state.modalShown} onDismiss={this.closeModal}>
                            <Dialog.Title>Are you sure?</Dialog.Title>
                            <Dialog.Content>
                                {_.get(this.state, 'modalMessage', '')
                                    .split('\n')
                                    .map((line, i) => (
                                        <Paragraph key={i}>{line}</Paragraph>
                                    ))}
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={this.closeModal} labelStyle={typographyStyles.button}>
                                    Cancel
                                </Button>
                                <Button
                                    onPress={this.state.modalConfirmation}
                                    color="red"
                                    labelStyle={typographyStyles.button}
                                >
                                    Delete
                                </Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ViewController>
                <FAB.Group
                    open={this.state.fabOpen}
                    color="white"
                    icon={this.state.fabOpen ? 'close' : 'plus'}
                    actions={[
                        {
                            icon: 'plus',
                            label: 'Assignment',
                            onPress: () => this.props.navigation.navigate('New Assignment'),
                        },
                        {
                            icon: 'plus',
                            label: 'Task',
                            onPress: () => this.props.navigation.navigate('New Task'),
                        },
                    ]}
                    onStateChange={({ open }) => this.setState({ fabOpen: open })}
                />
            </React.Fragment>
        );
    }
}

OverviewList.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
    assignmentSelectors: PropTypes.object,
    taskSelectors: PropTypes.object,
    scheduleSelectors: PropTypes.object,
    deleteAssignment: PropTypes.func,
    deleteTask: PropTypes.func,
};

const mapStateToProps = state => {
    const assignmentSelectors = getAssignmentsSelectors(state.assignments);
    const taskSelectors = getTasksSelectors(state.tasks);
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    return {
        assignmentSelectors,
        taskSelectors,
        scheduleSelectors,
    };
};

const mapDispatchToProps = {
    fetchAssignments,
    fetchTasks,
    deleteAssignment,
    deleteTask,
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewList);
