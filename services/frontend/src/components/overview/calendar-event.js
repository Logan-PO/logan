import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import './event.scss';
import { appropriateTextColor, printSectionTimes } from './scheduling-utils';

class CalendarEvent extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    asWeeklySection() {
        const section = _.get(this.props, 'event.section');
        const background = _.get(this.props, 'event.course.color');
        const color = appropriateTextColor(background || '#ffffff');

        return (
            <Paper className="logan-event" style={{ background, color }} elevation={0}>
                <Typography className="event-title">{this.props.title}</Typography>
                {section && <Typography className="event-subtitle">{printSectionTimes(section)}</Typography>}
            </Paper>
        );
    }

    asAssignment() {
        const color = _.get(this.props, 'event.course.color', '#000000');

        return (
            <Paper className="logan-event assignment-event" elevation={0}>
                <Typography className="event-title">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <AssignmentIcon style={{ fill: color }} className="event-icon" />
                        <span>{this.props.title}</span>
                    </div>
                </Typography>
            </Paper>
        );
    }

    render() {
        const type = _.get(this.props.event, 'type');

        switch (type) {
            case 'section':
                return this.asWeeklySection();
            case 'assignment':
                return this.asAssignment();
            default:
                throw new Error(`Unrecognized event type ${type}`);
        }
    }
}

CalendarEvent.propTypes = {
    title: PropTypes.string,
    event: PropTypes.object,
};

export default CalendarEvent;
