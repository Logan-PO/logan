import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Box } from '@material-ui/core';
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
        const defaultProps = {
            bgcolor: '#b5b0b0',
            m: 1,
            border: 1,
        };
        return (
            <div className="scrollable-list">
                <div className="scroll-view">
                    <List>
                        {this.props.sections.map(section => {
                            const [dueDate, eids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <Box borderColor="primary.main" {...defaultProps}>
                                        {dueDate}
                                    </Box>
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
    else return scheduleEvent.cid;
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
    function mapSectionToDates(section) {
        //generate a list of dayjs objects that have day js formatted dueDates/dates
        let sectionCellData = [];

        let initialDate = dayjs(section.startDate);
        let finalDate = dayjs(section.endDate);

        let duration = dayjs.duration(finalDate.diff(initialDate));
        let currentDate = initialDate;
        while (duration.asWeeks() >= 0) {
            if (duration.asWeeks() % section.weeklyRepeat === 0 && currentDate.w) {
                //TODO: This is where the formatting for the section cell comes from
                //console.log({ cid: section.cid, tid: section.tid, dueDate: currentDate });
                sectionCellData.push({ cid: section.cid, tid: section.tid, dueDate: currentDate });
            }
            console.log(duration);
            duration = duration.subtract(1, 'week');
            currentDate = currentDate.add(1, 'week');
            break;
        }
        return sectionCellData;
    } //TODO: Going to have the overview cell parse out which lower level cell it needs to display, e.g. overview-assignment or overview-task

    for (const section of scheduleSelectors.baseSelectors.sections.selectAll()) {
        //TODO: Map from its start day to days for the week and then add those event into the eventSelectors
        eventSelectors.push({ cid: section.cid, tid: section.tid, dueDate: dayjs(section.startDate) });
        /*    const tempSectionCellData = mapSectionToDates(section);
        for (const scheduledTime of tempSectionCellData) {
            eventSelectors.push(scheduledTime);
        }*/
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
