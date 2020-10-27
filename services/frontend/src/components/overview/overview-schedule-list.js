import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader } from '@material-ui/core';
import * as dateUtils from '@logan/core/src/date-utils';
import { fetchAssignments, getAssignmentsSelectors } from '../../store/assignments';
import '../shared/list.scss';
import { fetchTasks, getTasksSelectors, compareDueDates } from '../../store/tasks';
import OverviewCell from './overview-cell';

class OverviewScheduleList extends React.Component {
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
                                        <OverviewCell key={eid} eid={eid} selected={() => {}} />
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
}; //TODO Make it so that it chooses to render the correct cell based off of the type of ID

const getID = scheduleEvent => {
    return scheduleEvent.aid === null ? scheduleEvent.tid : scheduleEvent.aid;
};

const mapStateToProps = state => {
    const assignmentSelectors = getAssignmentsSelectors(state.assignments);
    const taskSelectors = getTasksSelectors(state.tasks);
    const eventSelectors = [];

    for (const task of taskSelectors.selectAll()) {
        eventSelectors.push(task);
    }

    for (const assignment of assignmentSelectors.selectAll()) {
        eventSelectors.push(assignment);
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
