import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, AppBar, Toolbar, FormControl, FormControlLabel, Switch } from '@material-ui/core';
import _ from 'lodash';
import { dateUtils } from '@logan/core';
import {
    fetchAssignments,
    getAssignmentsSelectors,
    deleteAssignment,
    setShouldGoToAssignment,
} from '@logan/fe-shared/store/assignments';
import { getSections } from '@logan/fe-shared/sorting/assignments';
import Fab from '../shared/controls/fab';
import AssignmentModal from './assignment-modal';
import AssignmentCell from './assignment-cell';
import '../shared/list.scss';
import classes from './assignments-list.module.scss';

class AssignmentsList extends React.Component {
    constructor(props) {
        super(props);

        this._shouldShowAssignment = this._shouldShowAssignment.bind(this);
        this.didSelectAssignment = this.didSelectAssignment.bind(this);
        this.didDeleteAssignment = this.didDeleteAssignment.bind(this);
        this.togglePastAssignments = this.togglePastAssignments.bind(this);
        this.openNewAssignmentModal = this.openNewAssignmentModal.bind(this);
        this.closeNewAssignmentModal = this.closeNewAssignmentModal.bind(this);

        this.state = {
            showingPastAssignments: false,
            selectedAssignment: undefined,
            newAssignmentModalOpen: false,
        };
    }

    togglePastAssignments(e) {
        this.setState({ showingPastAssignments: e.target.checked });
    }

    componentDidMount() {
        if (this.props.shouldGoToAssignment) {
            this.handleGoToAssignment();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.shouldGoToAssignment && this.props.shouldGoToAssignment !== prevProps.shouldGoToAssignment) {
            this.handleGoToAssignment();
        }
    }

    handleGoToAssignment() {
        const selectedAssignment = this.props.getAssignment(this.props.shouldGoToAssignment);

        const isPastAssignment =
            !!selectedAssignment &&
            dateUtils.dueDateIsDate(selectedAssignment.dueDate) &&
            dateUtils
                .dayjs(selectedAssignment.dueDate, dateUtils.constants.DB_DATE_FORMAT)
                .isBefore(dateUtils.dayjs(), 'day');

        this.setState({ showingPastAssignments: isPastAssignment });
        this.didSelectAssignment(this.props.shouldGoToAssignment);
        this.props.setShouldGoToAssignment(undefined);
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

    _shouldShowAssignment(assignment) {
        const today = dateUtils.dayjs();

        if (this.state.showingPastAssignments) {
            return dateUtils.dayjs(assignment.dueDate).isBefore(today, 'day');
        } else {
            return dateUtils.dayjs(assignment.dueDate).isSameOrAfter(today, 'day');
        }
    }

    render() {
        const sections = getSections(
            _.filter(this.props.assignments, this._shouldShowAssignment),
            this.state.showingPastAssignments
        );

        return (
            <div className="scrollable-list">
                <div className={`scroll-view ${classes.assignmentsList}`}>
                    <List>
                        {sections.map(section => {
                            const [dueDate, aids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <ListSubheader className="list-header">{dueDate}</ListSubheader>
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
                <AppBar position="relative" color="primary" className={classes.actionsBar}>
                    <Toolbar variant="dense">
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="default"
                                        checked={this.state.showingPastAssignments}
                                        onChange={this.togglePastAssignments}
                                    />
                                }
                                label={
                                    this.state.showingPastAssignments
                                        ? 'Showing past assignments'
                                        : 'Showing upcoming assignments'
                                }
                            />
                        </FormControl>
                    </Toolbar>
                </AppBar>
                <Fab className="add-button" onClick={this.openNewAssignmentModal} />
                <AssignmentModal open={this.state.newAssignmentModalOpen} onClose={this.closeNewAssignmentModal} />
            </div>
        );
    }
}
AssignmentsList.propTypes = {
    assignments: PropTypes.arrayOf(PropTypes.object),
    fetchAssignments: PropTypes.func,
    deleteAssignment: PropTypes.func,
    onAssignmentSelected: PropTypes.func,
    getAssignment: PropTypes.func,
    shouldGoToAssignment: PropTypes.string,
    setShouldGoToAssignment: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getAssignmentsSelectors(state.assignments);

    return {
        getAssignment: selectors.selectById,
        shouldGoToAssignment: state.assignments.shouldGoToAssignment,
        assignments: selectors.selectAll(),
    };
};

const mapDispatchToProps = {
    fetchAssignments,
    deleteAssignment,
    setShouldGoToAssignment,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsList);
