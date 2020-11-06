import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, Button } from '@material-ui/core';
import { dateUtils } from '@logan/core';
import { fetchAssignments, getAssignmentsSelectors } from '../../store/assignments';
import './overview-list.module.scss';
import { fetchTasks, getTasksSelectors } from '../../store/tasks';
import { getScheduleSelectors } from '../../store/schedule';
import OverviewCell from './overview-cell';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

export class OverviewScheduleList extends React.Component {
    constructor(props) {
        super(props);

        this.getRelevantData = this.getRelevantData.bind(this);
        this.changeCondense = this.changeCondense.bind(this);
        this.state = { condensed: false };
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
        console.log('click');
        this.setState({ condensed: !_.get(this.state, 'condensed', false) });
    }

    render() {
        const groups = this.getRelevantData();

        return (
            <div>
                <Button onClick={this.changeCondense}>Condense/Uncondense</Button>
                <div className="scrollable-list">
                    <div className="scroll-view">
                        <List>
                            {groups.map(([date, { sections, assignments, tasks }]) => {
                                return (
                                    <React.Fragment key={date.format()}>
                                        <ListSubheader disableSticky={true}>
                                            {dateUtils.humanReadableDate(date)}
                                        </ListSubheader>
                                        {sections.map(({ sid }) => (
                                            <OverviewCell
                                                condensed={_.get(this.state, 'condensed', false)}
                                                key={sid}
                                                eid={sid}
                                            />
                                        ))}
                                        {assignments.map(({ aid }) => (
                                            <OverviewCell
                                                condensed={_.get(this.state, 'condensed', false)}
                                                key={aid}
                                                eid={aid}
                                            />
                                        ))}
                                        {tasks.map(({ tid }) => (
                                            <OverviewCell
                                                condensed={_.get(this.state, 'condensed', false)}
                                                key={tid}
                                                eid={tid}
                                            />
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </div>
                </div>
            </div>
        );
    }
}

OverviewScheduleList.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScheduleList);
