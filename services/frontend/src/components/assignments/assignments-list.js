import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { List, ListSubheader, Fab } from '@material-ui/core';
import {
    fetchAssignments,
    getAssignmentsSelectors,
    deleteAssignment,
    compareDueDates,
    setShouldGoToAssignment,
} from '../../store/assignments';
import AssignmentModal from './assignment-modal';
import AssignmentCell from './assignment-cell';
import '../shared/list.scss';

class AssignmentsList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectAssignment = this.didSelectAssignment.bind(this);
        this.didDeleteAssignment = this.didDeleteAssignment.bind(this);
        this.openNewAssignmentModal = this.openNewAssignmentModal.bind(this);
        this.closeNewAssignmentModal = this.closeNewAssignmentModal.bind(this);

        this.state = {
            selectedAssignment: undefined,
            newAssignmentModalOpen: false,
        };
    }

    componentDidMount() {
        if (this.props.shouldGoToAssignment) {
            this.didSelectAssignment(this.props.shouldGoToAssignment);
            this.props.setShouldGoToAssignment(undefined);
        }
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

    openNewAssignmentModal() {
        this.setState({ newAssignmentModalOpen: true });
    }

    closeNewAssignmentModal() {
        this.setState({ newAssignmentModalOpen: false });
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
                <Fab className="add-button" color="secondary" onClick={this.openNewAssignmentModal}>
                    <AddIcon />
                </Fab>
                <AssignmentModal open={this.state.newAssignmentModalOpen} onClose={this.closeNewAssignmentModal} />
            </div>
        );
    }
}
AssignmentsList.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchAssignments: PropTypes.func,
    deleteAssignment: PropTypes.func,
    onAssignmentSelected: PropTypes.func,
    shouldGoToAssignment: PropTypes.string,
    setShouldGoToAssignment: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getAssignmentsSelectors(state.assignments);
    const sections = {};
    for (const assignment of selectors.selectAll()) {
        if (sections[assignment.dueDate]) sections[assignment.dueDate].push(assignment.aid);
        else sections[assignment.dueDate] = [assignment.aid];
    }

    return {
        shouldGoToAssignment: state.assignments.shouldGoToAssignment,
        sections: Object.entries(sections).sort((a, b) => compareDueDates(a[0], b[0])),
    };
};

const mapDispatchToProps = {
    fetchAssignments,
    deleteAssignment,
    setShouldGoToAssignment,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsList);
