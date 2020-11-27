import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from '@logan/core';
import { fetchAssignments, getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import { fetchTasks, getTasksSelectors } from '@logan/fe-shared/store/tasks';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { Text } from 'react-native-paper';
import AssignmentCell from '../assignments/assignment-cell';
import TaskCell from '../tasks/task-cell';
import Typography from '../shared/typography';
import ListItem from '../shared/list-item';
import ViewController from '../shared/view-controller';
import OverviewSectionCell from './overview-section-cell';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

export class OverviewList extends React.Component {
    constructor(props) {
        super(props);

        this.getRelevantData = this.getRelevantData.bind(this);
        this.changeCondense = this.changeCondense.bind(this);
        this.changeView = this.changeView.bind(this);

        this.state = { listView: true };
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

        return groups;
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
        return (
            <ListItem
                leftContent={
                    <Typography variant="button">
                        <Text>{title}</Text>
                    </Typography>
                }
            />
        );
    }

    render() {
        const groups = this.getRelevantData();

        return (
            <ViewController
                title="Overview"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActionIsFetch={true}
            >
                <ScrollView keyboardDismissMode="on-drag">
                    {groups.map(([date, { sections, assignments, tasks }]) => {
                        return (
                            <React.Fragment key={date.format()}>
                                <List.Subheader>{dateUtils.humanReadableDate(date)}</List.Subheader>
                                {sections.length > 0 && this.secondaryHeader('SCHEDULE')}
                                {sections.map(({ sid }) => (
                                    <OverviewSectionCell key={sid} sid={sid} />
                                ))}
                                {assignments.length > 0 && this.secondaryHeader('ASSIGNMENTS')}
                                {assignments.map(({ aid }) => (
                                    <AssignmentCell key={aid} aid={aid} />
                                ))}
                                {tasks.length > 0 && this.secondaryHeader('TASKS')}
                                {tasks.map(({ tid }) => (
                                    <TaskCell key={tid} tid={tid} />
                                ))}
                            </React.Fragment>
                        );
                    })}
                </ScrollView>
            </ViewController>
        );
    }
}

OverviewList.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
    assignmentSelectors: PropTypes.object,
    taskSelectors: PropTypes.object,
    scheduleSelectors: PropTypes.object,
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

const mapDispatchToProps = { fetchAssignments, fetchTasks };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewList);
