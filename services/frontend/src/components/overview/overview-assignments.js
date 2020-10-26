import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader } from '@material-ui/core';
import { fetchAssignments, getAssignmentsSelectors, compareDueDates } from '../../store/assignments';
import styles from '../assignments/assignments-list.module.scss';
import AssignmentCell from '../assignments/assignment-cell';

class OverviewAssignments extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.assignmentsList}>
                <div className={styles.scrollview}>
                    <List>
                        {this.props.sections.map(section => {
                            const [dueDate, aids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <ListSubheader className={styles.heading}>{dueDate}</ListSubheader>
                                    {aids.map(aid => (
                                        <AssignmentCell
                                            key={aid}
                                            aid={aid}
                                            onSelect={() => {}}
                                            onDelete={() => {}}
                                            selected={() => {}}
                                        />
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
OverviewAssignments.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchAssignments: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getAssignmentsSelectors(state.assignments);
    const sections = {};
    for (const assignment of selectors.selectAll()) {
        if (sections[assignment.dueDate]) sections[assignment.dueDate].push(assignment.aid);
        else sections[assignment.dueDate] = [assignment.aid];
    }

    return {
        sections: Object.entries(sections).sort((a, b) => compareDueDates(a[0], b[0])),
    };
};

const mapDispatchToProps = { fetchAssignments };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewAssignments);
