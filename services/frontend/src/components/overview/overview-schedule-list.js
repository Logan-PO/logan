//import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Box } from '@material-ui/core';
import * as dateUtils from '@logan/core/src/date-utils';
import { fetchAssignments, getAssignmentsSelectors } from '../../store/assignments';
import './overview-list.module.scss';
import { fetchTasks, getTasksSelectors, compareDueDates } from '../../store/tasks';
//import { getScheduleSelectors } from '../../store/schedule';
import OverviewCell from './overview-cell';

class OverviewScheduleList extends React.Component {
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
    if (scheduleEvent.aid) return scheduleEvent.aid;
    else if (scheduleEvent.tid) return scheduleEvent.tid;
    else return scheduleEvent.cid;
};

const mapStateToProps = state => {
    const assignmentSelectors = getAssignmentsSelectors(state.assignments);
    const taskSelectors = getTasksSelectors(state.tasks);
    //const scheduleSelectors = getScheduleSelectors(state.schedule);

    const eventSelectors = [];

    for (const task of taskSelectors.selectAll()) {
        if (!task.complete) eventSelectors.push(task);
    }

    for (const assignment of assignmentSelectors.selectAll()) {
        eventSelectors.push(assignment);
    }
    /*    for (const section of scheduleSelectors.baseSelectors.sections.selectAll()) {

        if (_.isMatch(section.daysOfWeek, dateUtils.dayjs().weekday())) {
            eventSelectors.push(section);
            console.log(`eventSelector: ${eventSelectors}`);
        }
    }*/

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
