import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { List, ListSubheader, Fab } from '@material-ui/core';
import {
    fetchAssignments,
    createAssignment,
    getAssignmentsSelectors,
    deleteAssignment,
    compareDueDates,
} from '../../store/assignments';
import AssignmentCell from './assignment-cell';
import '../shared/list.scss';

class AssignmentsList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectAssignment = this.didSelectAssignment.bind(this);
        this.didDeleteAssignment = this.didDeleteAssignment.bind(this);

        this.state = {
            selectedAssignment: undefined,
        };
    }

    randomAssignment() {
        return {
            class: 'PHYS',
            title: 'Random Assignment',
            desc: 'test',
            dueDate: 'soon',
            color: 'orange',
        };
    }

    didSelectAssignment(aid) {
        this.setState(() => ({ selectedAid: aid }));
        this.props.onAssignmentSelected(aid);
    }
    didDeleteAssignment(assignment) {
        this.props.deleteAssignment(assignment);
        // TODO: Select next assignment
        this.setState(() => ({ selectedAid: undefined }));
        this.props.onAssignmentSelected(undefined);
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
                                        <AssignmentCell
                                            key={aid}
                                            aid={aid}
                                            onSelect={this.didSelectAssignment}
                                            onDelete={this.didDeleteAssignment}
                                            selected={this.state.selectedAid === aid}
                                        />
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </List>
                </div>
                <Fab
                    className="add-button"
                    color="secondary"
                    onClick={() => this.props.createAssignment(this.randomAssignment())}
                >
                    <AddIcon />
                </Fab>
            </div>
        );
    }
}
AssignmentsList.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchAssignments: PropTypes.func,
    createAssignment: PropTypes.func,
    deleteAssignment: PropTypes.func,
    onAssignmentSelected: PropTypes.func,
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

const mapDispatchToProps = { fetchAssignments, createAssignment, deleteAssignment };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsList);
