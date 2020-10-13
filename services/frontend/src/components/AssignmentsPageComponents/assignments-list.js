import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAssignments, createAssignment } from '../../store/assignments';
import styles from './assignments-list.module.scss';
import AssignmentCell from './assignment-cell';

class AssignmentsList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectAssignment = this.didSelectAssignment.bind(this);

        this.state = {
            selectedAssignment: undefined,
        };
    }

    randomAssignment() {
        return {
            class: 'PHYS',
            name: 'Random Assignment',
            desc: 'test',
            day: 'soon',
            color: 'orange',
            id: 1,
        };
    }

    didSelectAssignment(aid) {
        this.setState(() => ({ selectedAid: aid }));
        this.props.onAssignmentSelected(aid);
    }

    render() {
        return (
            <div className={styles.assignmentsList}>
                <div className={styles.scrollview}>
                    {this.props.sections.map(section => {
                        const [day, assignments] = section;
                        return (
                            <React.Fragment key={section[0]}>
                                <div className={styles.heading}>{day}</div>
                                {assignments.map(assignment => (
                                    <AssignmentCell
                                        key={assignment.aid}
                                        aid={assignment.aid}
                                        onSelect={this.didSelectAssignment}
                                        selected={this.state.selectedAssignment === assignment.aid}
                                    />
                                ))}
                            </React.Fragment>
                        );
                    })}
                </div>
                <div className={styles.buttonBar}>
                    <button onClick={this.props.fetchAssignments}>Fetch</button>
                    <button onClick={() => this.props.createAssignment(this.randomAssignment())}>New</button>
                </div>
            </div>
        );
    }
}
AssignmentsList.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchAssignments: PropTypes.func,
    createAssignment: PropTypes.func,
    onAssignmentSelected: PropTypes.func,
};

const mapStateToProps = state => {
    const sections = {};
    for (const assignment of _.values(state.assignments.entities)) {
        if (sections[assignment.day]) sections[assignment.day].push(assignment);
        else sections[assignment.day] = [assignment];
    }

    return {
        sections: Object.entries(sections),
    };
};

const mapDispatchToProps = { fetchAssignments, createAssignment };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsList);
