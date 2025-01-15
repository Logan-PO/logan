import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Paper, colors } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { dateUtils } from 'packages/core';
import { appropriateTextColor, printSectionTimes } from 'packages/fe-shared/utils/scheduling-utils';
import './event.scss';

class CalendarEvent extends React.Component {
    constructor(props) {
        super(props);
    }

    asWeeklySection(isPast) {
        const viewType = _.get(this.props, 'event.viewType', 'week');
        const section = _.get(this.props, 'event.section');
        const background = _.get(this.props, 'event.course.color');

        const paperStyle = {
            background: viewType === 'week' ? background : 'none',
            color: viewType === 'week' ? appropriateTextColor(background || '#ffffff') : 'black',
        };

        return (
            <Paper className={`logan-event ${isPast ? 'past-event' : ''}`} style={paperStyle} elevation={0}>
                <div className="event-title">
                    <div className="event-flex-container">
                        {viewType === 'month' && <div className="swatch" style={{ background }} />}
                        {this.props.title}
                    </div>
                </div>
                {viewType === 'week' && section && <div className="event-subtitle">{printSectionTimes(section)}</div>}
            </Paper>
        );
    }

    asAssignment(isPast) {
        const color = _.get(this.props, 'event.course.color', '#000000');

        return (
            <Paper className={`logan-event assignment-event ${isPast ? 'past-event' : ''}`} elevation={0}>
                <div className="event-title">
                    <div className="event-flex-container">
                        <AssignmentIcon style={{ fill: color }} className="event-icon" />
                        <span>{this.props.title}</span>
                    </div>
                </div>
            </Paper>
        );
    }

    asHoliday() {
        const prior = this.props.continuesPrior ? 'continues-prior' : '';
        const after = this.props.continuesAfter ? 'continues-after' : '';

        return (
            <Paper
                className={`logan-event holiday-event ${prior} ${after}`}
                variant="outlined"
                elevation={0}
                style={{ background: colors.teal[100], borderColor: colors.teal[500] }}
            >
                <div className="event-title">{this.props.title}</div>
            </Paper>
        );
    }

    render() {
        const type = _.get(this.props.event, 'type');

        const eventStart = _.get(this.props, 'event.start');
        const eventDate = eventStart ? dateUtils.dayjs(eventStart) : null;
        const isPast = !!eventDate && dateUtils.dayjs().isAfter(eventDate, 'day');

        switch (type) {
            case 'section':
                return this.asWeeklySection(isPast);
            case 'assignment':
                return this.asAssignment(isPast);
            case 'holiday':
                return this.asHoliday();
            default:
                throw new Error(`Unrecognized event type ${type}`);
        }
    }
}

CalendarEvent.propTypes = {
    title: PropTypes.string,
    event: PropTypes.object,
    isAllDay: PropTypes.bool,
    continuesPrior: PropTypes.bool,
    continuesAfter: PropTypes.bool,
};

export default CalendarEvent;
