import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import * as dateUtils from '@logan/core/src/date-utils';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import './overview-weekly.scss';
import { getAssignmentsSelectors } from '@logan/fe-shared/store/assignments';
import OverviewScheduleList from './overview-schedule-list';
import CalendarEvent from './calendar-event';

const localizer = momentLocalizer(moment);

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;
let invalidDate;

class OverviewWeekly extends React.Component {
    constructor(props) {
        super(props);
        this.combineEvents = this.combineEvents.bind(this);
        this.changeView = this.changeView.bind(this);
        this.convertEvents = this.convertEvents.bind(this);
        this.formatEventForCalendar = this.formatEventForCalendar.bind(this);
        this.state = { listView: false, events: [] };

        let badDate = dateUtils.dayjs();
        invalidDate = {
            id: 0,
            title: 'Invalid Event',
            allDay: true,
            start: new Date(badDate.year(), badDate.month(), badDate.day()),
            end: new Date(badDate.year(), badDate.month(), badDate.day()),
            color: 'red',
        };
    }

    changeView() {
        this.setState({
            listView: !_.get(this.state, 'listView', false),
            events: this.props.events,
        });
    }

    combineEvents() {
        const events = [];

        const allAssignments = this.props.assignmentSelectors.selectAll();
        const allSections = this.props.scheduleSelectors.baseSelectors.sections.selectAll();
        for (const assignment of allAssignments) {
            events.push(assignment);
        }
        for (const sections of allSections) {
            events.push(sections);
        }
        return events;
    }
    /*{
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2015, 3, 0),
    end: new Date(2015, 3, 1),
},*/

    isDuringTerm(section, date) {
        return dayjs(section.endDate).diff(date) >= 0 && dayjs(section.startDate).diff(date) < 0;
    }

    isSameWeekDay(date, daysOfWeek) {
        return _.find(daysOfWeek, element => element === date.weekday()) != undefined;
    }

    isThisWeek(curDate, finDate, repeatMod) {
        let duration = dayjs.duration(finDate.diff(curDate));
        return _.floor(duration.asWeeks()) % repeatMod === 0;
    }

    mapSectionToDates(section) {
        const course = this.props.getCourse(section.cid);
        const startDate = dateUtils.toDate(section.startDate);
        const endDate = dateUtils.toDate(section.endDate);
        const startTime = dateUtils.toTime(section.startTime);
        const endTime = dateUtils.toTime(section.endTime);

        const displayName = _.isEmpty(course.nickname) ? course.title : course.nickname;

        //generate a list of dayjs objects that have day js formatted dueDates/dates
        let sectionCellData = [];

        //get the current date and set the hours min and secs to 0
        let runnerDate = dateUtils.toDate(section.startDate).startOf('day');
        while (runnerDate.isBetween(startDate, endDate, 'day', '[]')) {
            if (
                this.isSameWeekDay(runnerDate, section.daysOfWeek) &&
                this.isThisWeek(runnerDate, endDate, section.weeklyRepeat)
            ) {
                const sectionStart = runnerDate.hour(startTime.hour()).minute(startTime.minute());
                const sectionEnd = runnerDate.hour(endTime.hour()).minute(endTime.minute());

                sectionCellData.push({
                    type: 'section',
                    section,
                    course,
                    title: displayName,
                    allDay: false,
                    start: sectionStart.toDate(),
                    end: sectionEnd.toDate(),
                });
            }

            runnerDate = runnerDate.add(1, 'day');
        }
        return sectionCellData;
    }

    formatEventForCalendar(event) {
        let date = dateUtils.dayjs(event.dueDate, DB_DATE_FORMAT);
        const course = this.props.getCourse(event.cid);

        if (event.aid) {
            //event is an assignment
            return [
                {
                    type: 'assignment',
                    id: event.aid,
                    title: event.title,
                    assignment: event,
                    course,
                    allDay: true,
                    start: date.toDate(),
                    end: date.toDate(),
                    desc: event.description,
                },
            ];
        } else if (event.sid) {
            //event is a section
            //creates of list of dates to add to the calendar
            let sectionDateList = this.mapSectionToDates(event);

            return sectionDateList;
        } else {
            return [invalidDate];
        }
    }

    convertEvents(events) {
        console.log(events);
        let formattedEventList = [];

        for (const ev of events) {
            for (const item of this.formatEventForCalendar(ev)) {
                formattedEventList.push(item);
            }
        }
        return formattedEventList;
    }
    Event({ event }) {
        return (
            //Controls the color of the text
            <span>
                <span style={{ color: 'white' }}>{event.title}</span>
                {event.desc && `:  ${event.desc}`}
            </span>
        );
    }
    render() {
        return (
            <Grid container spacing={0}>
                <Grid item xs={9} style={{ height: 'calc(100vh - 64px)' }}>
                    <div className="scroll-view">
                        <Calendar
                            localizer={localizer}
                            defaultDate={new Date()}
                            defaultView="week"
                            views={['month', 'week']}
                            style={{ height: 'calc(100vh - 64px)' }}
                            events={this.convertEvents(this.combineEvents())}
                            eventPropGetter={() => ({ style: { background: 'none' } })}
                            components={{
                                event: CalendarEvent,
                            }}
                            // components={{
                            //     event: this.Event,
                            // }}
                            step={60} //how much is one slot worth ( in min)
                            timeslots={1}
                        />
                    </div>
                </Grid>
                <Grid item xs={3} style={{ height: 'calc(100vh - 64px)' }}>
                    <div className="scrollable-list">
                        <div className="scroll-view">
                            <OverviewScheduleList />
                        </div>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

OverviewWeekly.propTypes = {
    events: PropTypes.array,
    getCourse: PropTypes.func,
    assignmentSelectors: PropTypes.object,
    scheduleSelectors: PropTypes.object,
};

const mapStateToProps = state => {
    const assignmentSelectors = getAssignmentsSelectors(state.assignments);
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    return {
        assignmentSelectors,
        scheduleSelectors,
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
    };
};

export default connect(mapStateToProps, null)(OverviewWeekly);
