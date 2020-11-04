import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader } from '@material-ui/core';
import dayjs from 'dayjs';
import * as dateUtils from '@logan/core/src/date-utils';
import { fetchAssignments, getAssignmentsSelectors } from '../../store/assignments';
import './overview-list.module.scss';
import { fetchTasks, getTasksSelectors, compareDueDates } from '../../store/tasks';
import { getScheduleSelectors } from '../../store/schedule';
import OverviewCell from './overview-cell';

export class OverviewScheduleList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="scrollable-list">
                <div className="scroll-view">
                    <List>
                        {this.props.sections.map(section => {
                            const [dueDate, eids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <ListSubheader>{dueDate}</ListSubheader>
                                    {eids.map(eid => (
                                        <OverviewCell key={eid} eid={eid} />
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </List>
                </div>
            </div>
        );
    }
}
OverviewScheduleList.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchAssignments: PropTypes.func,
    fetchTasks: PropTypes.func,
};

const getID = scheduleEvent => {
    if (scheduleEvent.tid) return scheduleEvent.tid;
    else if (scheduleEvent.aid) return scheduleEvent.aid;
    else return scheduleEvent.section.sid;
};

const mapStateToProps = state => {
    const assignmentSelectors = getAssignmentsSelectors(state.assignments);
    const taskSelectors = getTasksSelectors(state.tasks);
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    const eventSelectors = [];

    for (const task of taskSelectors.selectAll()) {
        if (!task.complete) eventSelectors.push(task);
    }

    for (const assignment of assignmentSelectors.selectAll()) {
        eventSelectors.push(assignment);
    }
    /* title: 'New section',
            cid: this.props.cid,
            tid: course.tid,
            startDate: term.startDate,2020-12-11
            endDate: term.endDate,2020-8-27
            startTime: '08:00',
            endTime: '09:00',
            daysOfWeek: [1, 3, 5],
            weeklyRepeat: 1,*/
    function isDuringTerm(section, date) {
        return dayjs(section.endDate).diff(date) >= 0 && dayjs(section.startDate).diff(date) < 0;
    }
    function isSameWeekDay(date, daysOfWeek) {
        return _.find(daysOfWeek, element => element === date.weekday()) != null;
    }
    function isThisWeek(curDate, finDate, repeatMod) {
        let duration = dayjs.duration(finDate.diff(curDate));
        return _.floor(duration.asWeeks()) % repeatMod === 0;
    }
    function mapSectionToDates(section) {
        //generate a list of dayjs objects that have day js formatted dueDates/dates
        let sectionCellData = [];

        let finalDate = dayjs(section.endDate);

        let currentDate = dateUtils.dayjs();
        while (isDuringTerm(section, currentDate)) {
            if (
                isSameWeekDay(currentDate, section.daysOfWeek) &&
                isThisWeek(currentDate, finalDate, section.weeklyRepeat)
            ) {
                let tempDate = dayjs(section.startTime, 'HH:mm');
                let sectionDate = currentDate.add(tempDate.hour(), 'hour');
                sectionDate = sectionDate.add(tempDate.minute(), 'minute');
                sectionDate = dateUtils.dayjs.utc(sectionDate).local().format();
                sectionCellData.push({ section: section, dueDate: sectionDate });
            }
            currentDate = currentDate.add(1, 'day');
            //break;
        }
        return sectionCellData;
    } //TODO: Going to have the overview cell parse out which lower level cell it needs to display, e.g. overview-assignment or overview-task

    for (const section of scheduleSelectors.baseSelectors.sections.selectAll()) {
        //TODO: Map from its start day to days for the week and then add those event into the eventSelectors
        console.log(section.title);
        const tempSectionCellData = mapSectionToDates(section);
        for (const scheduledTime of tempSectionCellData) {
            eventSelectors.push(scheduledTime);
        }
    }

    const eventSections = {};
    for (const scheduleEvent of eventSelectors) {
        const key = dateUtils.dueDateIsDate(scheduleEvent.dueDate)
            ? dateUtils.dayjs(scheduleEvent.dueDate)
            : scheduleEvent.dueDate;
        if (eventSections[key]) eventSections[key].push(getID(scheduleEvent));
        else eventSections[key] = [getID(scheduleEvent)];
    }

    return {
        sections: Object.entries(eventSections).sort((a, b) => compareDueDates(a[0], b[0])),
    };
};

const mapDispatchToProps = { fetchAssignments, fetchTasks };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScheduleList);
