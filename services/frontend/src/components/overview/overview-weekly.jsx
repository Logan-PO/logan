import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Toolbar from './toolbar';
import OverviewScheduleList from './overview-schedule-list';
import CalendarEvent from './calendar-event';
import './overview-weekly.scss';
import styles from './overview-weekly.module.scss';
import { getAssignmentsSelectors } from 'packages/fe-shared/store/assignments';
import { getScheduleSelectors } from 'packages/fe-shared/store/schedule';
import * as dateUtils from 'packages/core/src/date-utils';

const localizer = momentLocalizer(moment);

const { dayjs } = dateUtils;

class OverviewWeekly extends React.Component {
    constructor(props) {
        super(props);

        this.getCalendarEvents = this.getCalendarEvents.bind(this);
        this.formatAssignment = this.formatAssignment.bind(this);
        this.formatHoliday = this.formatHoliday.bind(this);
        this.mapSectionToDates = this.mapSectionToDates.bind(this);
        this.viewTypeChanged = this.viewTypeChanged.bind(this);

        this.state = {
            viewType: 'week',
            events: [],
        };
    }

    viewTypeChanged(newType) {
        this.setState({ viewType: newType });
    }

    getCalendarEvents() {
        const allAssignments = this.props.assignmentSelectors.selectAll();
        const allSections = this.props.scheduleSelectors.baseSelectors.sections.selectAll();
        const allHolidays = this.props.scheduleSelectors.baseSelectors.holidays.selectAll();

        const events = [];

        events.push(...allHolidays.map(this.formatHoliday));
        events.push(...allAssignments.map(this.formatAssignment));

        const holidayDates = allHolidays.map(holiday => ({
            start: dateUtils.toDate(holiday.startDate),
            end: dateUtils.toDate(holiday.endDate),
        }));

        for (const section of allSections) {
            events.push(...this.mapSectionToDates(section, holidayDates));
        }

        return events;
    }

    isSameWeekDay(date, daysOfWeek) {
        return daysOfWeek.includes(date.weekday());
    }

    isThisWeek(curDate, finDate, repeatMod) {
        let duration = dayjs.duration(finDate.diff(curDate));
        return _.floor(duration.asWeeks()) % repeatMod === 0;
    }

    mapSectionToDates(section, holidayDates) {
        function isDuringHoliday(date) {
            for (const { start, end } of holidayDates) {
                if (date.isBetween(start, end, 'day', '[]')) return true;
            }

            return false;
        }

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
                !isDuringHoliday(runnerDate) &&
                this.isSameWeekDay(runnerDate, section.daysOfWeek) &&
                this.isThisWeek(runnerDate, endDate, section.weeklyRepeat)
            ) {
                const sectionStart = runnerDate.hour(startTime.hour()).minute(startTime.minute());
                const sectionEnd = runnerDate.hour(endTime.hour()).minute(endTime.minute());

                sectionCellData.push({
                    viewType: this.state.viewType,
                    type: 'section',
                    section,
                    course,
                    title: displayName,
                    allDay: this.state.viewType === 'month',
                    start: sectionStart.toDate(),
                    end: sectionEnd.toDate(),
                });
            }

            runnerDate = runnerDate.add(1, 'day');
        }
        return sectionCellData;
    }

    formatAssignment(assignment) {
        const dueDate = dateUtils.toDate(assignment.dueDate);
        const course = this.props.getCourse(assignment.cid);

        return {
            viewType: this.state.viewType,
            type: 'assignment',
            id: assignment.aid,
            title: assignment.title,
            assignment,
            course,
            allDay: this.state.viewType === 'week',
            start: dueDate.toDate(),
            end: dueDate.toDate(),
        };
    }

    formatHoliday(holiday) {
        const startDate = dateUtils.toDate(holiday.startDate);
        const endDate = dateUtils.toDate(holiday.endDate);

        return {
            viewType: this.state.viewType,
            type: 'holiday',
            id: holiday.hid,
            title: holiday.title,
            holiday,
            allDay: true,
            start: startDate.toDate(),
            end: endDate.toDate(),
        };
    }

    render() {
        return (
            <div className={styles.overviewPage}>
                {this.state.viewType === 'week' && (
                    <div className={styles.listContainer}>
                        <OverviewScheduleList />
                    </div>
                )}
                {this.state.viewType === 'week' && <div className={styles.divider} />}
                <div
                    className={styles.calendarContainer}
                    style={{ width: this.state.viewType === 'week' ? '75%' : '100%' }}
                >
                    <Calendar
                        className="full-overview-height"
                        localizer={localizer}
                        defaultDate={new Date()}
                        defaultView="week"
                        views={['month', 'week']}
                        onView={this.viewTypeChanged}
                        events={this.getCalendarEvents()}
                        popup={true}
                        eventPropGetter={() => ({ className: `view-type-${this.state.viewType}` })}
                        components={{
                            toolbar: Toolbar,
                            event: CalendarEvent,
                        }}
                        step={60} //how much is one slot worth (in min)
                        timeslots={1} //How many time slots one cell is worth
                        formats={{
                            dateFormat: date => {
                                const day = dateUtils.dayjs(date);
                                if (day.date() === 1) return day.format('MMM D');
                                else return day.format('D');
                            },
                            timeGutterFormat: 'h:mma',
                            weekdayFormat: 'ddd',
                            dayFormat: date =>
                                `${dayjs(date).format('ddd').toUpperCase()} / ${dayjs(date).format('Do')}`,
                            dayRangeHeaderFormat: ({ start, end }) => {
                                const startDate = dayjs(start);
                                const endDate = dayjs(end);

                                if (startDate.isSame(endDate, 'month')) {
                                    return `${startDate.format('MMMM Do')} - ${endDate.format('Do')}`;
                                } else {
                                    return `${startDate.format('MMMM Do')} - ${endDate.format('MMMM Do')}`;
                                }
                            },
                        }}
                    />
                </div>
            </div>
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
