import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from '@material-ui/core';
import { dateUtils } from 'packages/core';
import { fetchAssignments, getAssignmentsSelectors } from 'packages/fe-shared/store/assignments';
import { fetchTasks, getTasksSelectors } from 'packages/fe-shared/store/tasks';
import { getScheduleSelectors } from 'packages/fe-shared/store/schedule';
import { displayNameForCourse } from 'packages/fe-shared/utils/scheduling-utils';
import AssignmentCell from '../assignments/assignment-cell';
import TaskCell from '../tasks/task-cell';
import ListHeader from '../shared/list-header';
import ListSubheader from '../shared/list-subheader';
import { EmptySticker } from '../shared/displays';
import Typography from '../shared/typography';
import OverviewSectionCell from './overview-section-cell';
import styles from './overview-schedule-list.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

export class OverviewScheduleList extends React.Component {
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

        const now = dayjs();
        let runner = dayjs();
        let end = dayjs().add(7, 'days');

        while (runner.isSameOrBefore(end, 'day')) {
            const sections = sectionsForDate(runner);
            const assignments = filterByDate(allAssignments, runner);
            const tasks = _.reject(filterByDate(allTasks, runner), 'complete');

            // Remove any of today's sections that already occurred
            if (runner.isSame(now, 'day')) {
                for (let i = 0; i < sections.length; i++) {
                    if (dateUtils.toTime(sections[i].endTime).isBefore(now)) {
                        sections.splice(i--, 1);
                    }
                }
            }

            if (!_.isEmpty(sections) || !_.isEmpty(assignments) || !_.isEmpty(tasks)) {
                groups.push([runner, { sections, assignments, tasks }]);
            } else {
                groups.push([runner, {}]);
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
            <ListSubheader
                classes={{ root: styles.subheader, divider: styles.subheaderDivider }}
                items={[title]}
                colors={['textSecondary']}
                key={title}
                isBig
                showHorizontalDivider
            />
        );
    }

    _scheduleOverview(sections) {
        return (
            <React.Fragment>
                {sections.length > 0 && this.secondaryHeader('Schedule')}
                {sections.map(({ sid }) => (
                    <OverviewSectionCell className={styles.cell} key={sid} sid={sid} />
                ))}
            </React.Fragment>
        );
    }

    _assignmentsOverview(assignments) {
        if (!assignments.length) return;

        const groupings = _.groupBy(assignments, 'cid');

        const sortedEntries = _.sortBy(_.entries(groupings), '0');

        return (
            <React.Fragment>
                {this.secondaryHeader('Assignments')}
                {sortedEntries.map(([cid, groupedAssignments]) => {
                    const course = this.props.scheduleSelectors.baseSelectors.courses.selectById(cid);

                    let subheader;

                    if (course) {
                        subheader = (
                            <ListSubheader
                                classes={{ root: styles.subheader }}
                                items={[displayNameForCourse(course)]}
                                colors={[course.color]}
                            />
                        );
                    }

                    return (
                        <React.Fragment key={cid}>
                            {subheader}
                            {groupedAssignments.map(({ aid }) => (
                                <AssignmentCell className={styles.cell} key={aid} aid={aid} />
                            ))}
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    }

    _tasksOverview(tasks) {
        if (!tasks.length) return;

        const groupings = _.groupBy(tasks, task => {
            const assignment = task.aid ? this.props.assignmentSelectors.selectById(task.aid) : undefined;
            return `${(assignment ? assignment.cid : task.cid) || ''} ${task.aid || ''}`;
        });

        const sortedEntries = _.sortBy(_.entries(groupings), '0');

        const contents = [];

        for (const [sortKey, tasks] of sortedEntries) {
            const [cid, aid] = sortKey.split(' ');

            if (cid || aid) {
                const items = [];
                const colors = [];

                if (cid) {
                    const course = this.props.scheduleSelectors.baseSelectors.courses.selectById(cid);

                    if (course) {
                        items.push(displayNameForCourse(course));
                        colors.push(course.color);
                    }
                }

                if (aid) {
                    const assignment = this.props.assignmentSelectors.selectById(aid);

                    if (assignment) {
                        items.push(assignment.title);
                        colors.push('textPrimary');
                    }
                }

                contents.push(
                    <ListSubheader
                        key={sortKey}
                        classes={{
                            root: styles.subheader,
                            breadcrumbs: styles.breadcrumbs,
                            chevron: styles.chevron,
                        }}
                        items={items}
                        colors={colors}
                    />
                );
            }

            contents.push(
                ...tasks.map(({ tid }) => <TaskCell className={styles.cell} key={tid} tid={tid} disableActions />)
            );
        }

        return (
            <React.Fragment>
                {this.secondaryHeader('Tasks')}
                {contents}
            </React.Fragment>
        );
    }

    render() {
        const groups = this.getRelevantData();

        if (!groups.length) {
            return (
                <EmptySticker message="If you have classes, assignments, or tasks in the next 7 days they'll show up here. Enjoy your free week!" />
            );
        }

        return (
            <div className="scrollable-list">
                <div className={`scroll-view ${styles.overviewList}`}>
                    <List className={styles.listContent}>
                        {groups.map(([date, { sections, assignments, tasks }]) => {
                            const isToday = dateUtils.humanReadableDate(date) === 'Today';
                            let sectionDetail;

                            if (!isToday) {
                                sectionDetail = `${dateUtils
                                    .toDate(date)
                                    .diff(dateUtils.dayjs().startOf('day'), 'day')}D`;
                            }

                            return (
                                <div className={styles.section} key={date.format()}>
                                    <ListHeader
                                        title={dateUtils.humanReadableDate(date, { includeWeekday: true })}
                                        detail={sectionDetail}
                                        className={styles.header}
                                        isBig={isToday}
                                    />
                                    {!sections && !assignments && !tasks ? (
                                        <div className={`${styles.cell} ${styles.dummy}`}>
                                            <Typography color="textSecondary">Nothing planned</Typography>
                                        </div>
                                    ) : (
                                        <React.Fragment>
                                            {this._scheduleOverview(sections)}
                                            {this._assignmentsOverview(assignments)}
                                            {this._tasksOverview(tasks)}
                                        </React.Fragment>
                                    )}
                                </div>
                            );
                        })}
                    </List>
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
