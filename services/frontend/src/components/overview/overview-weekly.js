import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import * as dateUtils from '@logan/core/src/date-utils';
import { getScheduleSelectors } from '../../store/schedule';
import OverviewScheduleList from './overview-schedule-list';
import './overview-weekly.scss';

const localizer = momentLocalizer(moment);
/*const events = [
    {
        start: moment().toDate(),
        end: moment().add(1, 'days').toDate(),
        title: 'Some title',
    },
];*/
const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;
class OverviewWeekly extends React.Component {
    constructor(props) {
        super(props);
        this.state = { listView: false, events: this.props.events }; //TODO: events need to be in state so that calendar will update
        this.changeView = this.changeView.bind(this);
        this.convertEvents = this.convertEvents.bind(this);
        this.formatEventForCalendar = this.formatEventForCalendar.bind(this);
    }

    changeView() {
        this.setState({
            listView: !_.get(this.state, 'listView', false),
            events: this.props.events,
        });
    } //TODO: Need convert to event method
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
        //generate a list of dayjs objects that have day js formatted dueDates/dates
        let sectionCellData = [];

        let finalDate = dayjs(section.endDate, DB_DATE_FORMAT);

        //get the current date and set the hours min and secs to 0
        let currentDate = dateUtils.dayjs(section.startDate, DB_DATE_FORMAT).hour(0).minute(0).second(0);
        currentDate = currentDate.add(1, 'day');
        while (this.isDuringTerm(section, currentDate)) {
            if (
                this.isSameWeekDay(currentDate, section.daysOfWeek) &&
                this.isThisWeek(currentDate, finalDate, section.weeklyRepeat)
            ) {
                let tempDate = dayjs(section.startTime, DB_TIME_FORMAT);
                let endTime = dayjs(section.endTime, DB_TIME_FORMAT);
                let sectionDate = currentDate.add(tempDate.hour(), 'hour');
                sectionDate = sectionDate.add(tempDate.minute(), 'minute');
                console.log(sectionDate.date());
                sectionCellData.push({
                    id: section.sid,
                    title: section.title,
                    allDay: false,
                    start: new Date(
                        sectionDate.year(),
                        sectionDate.month(),
                        sectionDate.date(),
                        sectionDate.hour(),
                        sectionDate.minute()
                    ),
                    end: new Date(
                        sectionDate.year(),
                        sectionDate.month(),
                        sectionDate.date(),
                        endTime.hour(),
                        endTime.minute()
                    ),
                    desc: section.location,
                    color: course ? course.color : 'blue',
                });
            }
            currentDate = currentDate.add(1, 'day');
        }
        return sectionCellData;
    }

    formatEventForCalendar(eevent) {
        let date = dateUtils.dayjs(eevent.dueDate, DB_DATE_FORMAT);
        const course = this.props.getCourse(eevent.cid);

        if (eevent.tid) {
            //the event is a task
            return [
                {
                    id: eevent.tid,
                    title: eevent.title,
                    allDay: true,
                    start: new Date(date.year(), date.month(), date.date()),
                    end: new Date(date.year(), date.month(), date.date()),
                    desc: eevent.description,
                    color: course ? course.color : 'blue',
                },
            ];
        } else if (eevent.aid) {
            //event is an assignment
            return [
                {
                    id: eevent.aid,
                    title: eevent.title,
                    allDay: true,
                    start: new Date(date.year(), date.month(), date.date()),
                    end: new Date(date.year(), date.month(), date.date()),
                    desc: eevent.description,
                    color: course ? course.color : 'blue',
                },
            ];
        } else if (eevent.sid) {
            //event is a section
            //TODO:Create a list of date objects to put onto calendar
            let sectionDateList = this.mapSectionToDates(eevent);

            return sectionDateList;
        } else {
            let badDate = dateUtils.dayjs();
            return [
                {
                    id: 0,
                    title: 'Invalid Event',
                    allDay: true,
                    start: new Date(badDate.year(), badDate.month(), badDate.day()),
                    end: new Date(badDate.year(), badDate.month(), badDate.day()),
                    color: 'red',
                },
            ];
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
            //TODO: This is where you edit the color of the text
            <span>
                <span style={{ color: 'black' }}>{event.title}</span>
                {event.desc && `:  ${event.desc}`}
            </span>
        );
    }
    render() {
        return _.get(this.state, 'listView', false) ? (
            <OverviewScheduleList />
        ) : (
            <div>
                <Button onClick={this.changeView}>Agenda View</Button>
                <Calendar
                    localizer={localizer}
                    defaultDate={new Date()}
                    defaultView="month"
                    events={this.convertEvents(_.get(this.state, 'events', []))}
                    style={{ height: '130vh' }} //TODO: If this value is <120 the week view is not adjusted properly
                    eventPropGetter={event => {
                        const backgroundColor = event ? event.color : '#fff';
                        return { style: { backgroundColor } };
                    }}
                    components={{
                        event: this.Event,
                    }}
                />
            </div>
        );
    }
}

OverviewWeekly.propTypes = {
    events: PropTypes.array,
    getCourse: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        getCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
    };
};

export default connect(mapStateToProps, null)(OverviewWeekly);
