import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import { List, ListSubheader, AppBar, Toolbar, FormControl, FormControlLabel, Switch, Fab } from '@material-ui/core';
import _ from 'lodash';
import { dateUtils } from '@logan/core';
import { fetchAssignments, createAssignment, getAssignmentsSelectors, deleteAssignment } from '../../store/assignments';
import AssignmentCell from './assignment-cell';
import '../shared/list.scss';
import classes from './assignments-list.module.scss';
import { getSections } from './sorting';

class AssignmentsList extends React.Component {
    constructor(props) {
        super(props);

        this._shouldShowAssignment = this._shouldShowAssignment.bind(this);
        this.didSelectAssignment = this.didSelectAssignment.bind(this);
        this.didDeleteAssignment = this.didDeleteAssignment.bind(this);
        this.togglePastAssignments = this.togglePastAssignments.bind(this);

        this.state = {
            showingPastAssignments: false,
            selectedAssignment: undefined,
        };
    }

    togglePastAssignments(e) {
        this.setState({ showingPastAssignments: e.target.checked });
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
                <AppBar position="relative" color="primary">
                    <Toolbar variant="dense">
                        <FormControl>
                            <FormControlLabel
                                control={<Switch color="default" />}
                                label={
                                    this.state.showingPastAssignments
                                        ? 'Showing past assignments'
                                        : 'Showing upcoming assignments'
                                }
                                value={this.state.showingPastAssignments}
                                onChange={this.togglePastAssignments}
                            />
                        </FormControl>
                    </Toolbar>
                </AppBar>
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
    assignments: PropTypes.arrayOf(PropTypes.object),
    fetchAssignments: PropTypes.func,
    createAssignment: PropTypes.func,
    deleteAssignment: PropTypes.func,
    onAssignmentSelected: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getAssignmentsSelectors(state.assignments);

    return {
        assignments: selectors.selectAll(),
    };
};

const mapDispatchToProps = { fetchAssignments, createAssignment, deleteAssignment };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsList);
