import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import OverviewScheduleList from './overview-schedule-list';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const events = [
    {
        start: moment().toDate(),
        end: moment().add(1, 'days').toDate(),
        title: 'Some title',
    },
];
export class OverviewWeekly extends React.Component {
    constructor(props) {
        super(props);
        this.state = { listView: false }; //TODO: events need to be in state so that calendar will update
        this.changeView = this.changeView.bind(this);
    }

    changeView() {
        this.setState({
            listView: !_.get(this.state, 'listView', false),
        });
    } //TODO: Need convert to event method
    /*{
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2015, 3, 0),
    end: new Date(2015, 3, 1),
},*/
    convertEvents(events) {
        for (ev of events) {
        }
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
                    events={events}
                    style={{ height: '85vh' }}
                />
            </div>
        );
    }
}

OverviewWeekly.propTypes = {
    events: PropTypes.object,
};
