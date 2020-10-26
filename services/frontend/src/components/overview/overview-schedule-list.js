import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader } from '@material-ui/core';
import { fetchAssignments, getAssignmentsSelectors } from '../../store/assignments';
import '../shared/list.scss';
import { fetchTasks, getTasksSelectors, compareDueDates } from '../../store/tasks';
import OverviewAssignmentCell from './overview-assignment-cell';

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
                            const [dueDate, aids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <ListSubheader>{dueDate}</ListSubheader>
                                    {aids.map(aid => (
                                        <OverviewAssignmentCell key={aid} aid={aid} selected={() => {}} />
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
    return scheduleEvent.aid === null ? scheduleEvent.tid : scheduleEvent.aid;
};

const mapStateToProps = state => {
    const assignmentSelectors = getAssignmentsSelectors(state.assignments);
    const taskSelectors = getTasksSelectors(state.tasks);

    /*const taskSections = {};
    for (const task of taskSelectors.selectAll()) {
        const key = dateUtils.dueDateIsDate(task.dueDate) ? dateUtils.dayjs(task.dueDate) : task.dueDate;
        if (taskSections[key]) taskSections[key].push(task.tid);
        else taskSections[key] = [task.tid];
    }

    const assignmentSections = {};
    for (const assignment of assignmentSelectors.selectAll()) {
        if (assignmentSections[assignment.dueDate]) assignmentSections[assignment.dueDate].push(assignment.aid);
        else assignmentSections[assignment.dueDate] = [assignment.aid];
    }*/
    const eventSelectors = {};
    eventSelectors.addAll(assignmentSelectors.selectAll());
    eventSelectors.addAll(taskSelectors.selectAll());

    const eventSections = {};
    for (const scheduleEvent of eventSelectors) {
        if (eventSections[scheduleEvent.dueDate]) eventSections[scheduleEvent.dueDate].push(getID(scheduleEvent));
        else eventSections[scheduleEvent.dueDate] = [getID(scheduleEvent)];
    }

    return {
        sections: Object.entries(eventSections).sort((a, b) => compareDueDates(a[0], b[0])),
    }; //TODO: This should be the combined sections here
};

const mapDispatchToProps = { fetchAssignments, fetchTasks };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScheduleList);
