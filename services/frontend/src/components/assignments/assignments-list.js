import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, FormControl, FormControlLabel, Switch } from '@material-ui/core';
import _ from 'lodash';
import { dateUtils } from 'packages/core';
import {
    fetchAssignments,
    getAssignmentsSelectors,
    deleteAssignment,
    setShouldGoToAssignment,
} from 'packages/fe-shared/store/assignments';
import { getCourseSelectors } from 'packages/fe-shared/store/schedule';
import { getSections } from 'packages/fe-shared/sorting/assignments';
import Fab from '../shared/controls/fab';
import ListHeader from '../shared/list-header';
import ListSubheader from '../shared/list-subheader';
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
        this.didSelectAssignment(undefined);
    }

    openNewAssignmentModal() {
        this.setState({ newAssignmentModalOpen: true });
    }

    closeNewAssignmentModal({ newAssignment }) {
        this.setState({ newAssignmentModalOpen: false });

        if (newAssignment && newAssignment.aid) {
            this.didSelectAssignment(newAssignment.aid);
        }
    }

    _shouldShowAssignment(assignment) {
        const today = dateUtils.dayjs();

        if (this.state.showingPastAssignments) {
            return dateUtils.dayjs(assignment.dueDate).isBefore(today, 'day');
        } else {
            return dateUtils.dayjs(assignment.dueDate).isSameOrAfter(today, 'day');
        }
    }

    _headerForSection(dueDate) {
        let sectionTitle = dueDate;
        let sectionDetail;

        const isToday = dateUtils.formatAsDate() === dueDate;

        const dateObject = dateUtils.toDate(dueDate);
        sectionTitle = dateUtils.humanReadableDate(dateObject, { includeWeekday: true });

        if (!this.state.showingPastAssignments && !isToday) {
            sectionDetail = `${dateObject.diff(dateUtils.dayjs().startOf('day'), 'day')}D`;
        }

        return (
            <ListHeader
                className={`list-header ${classes.header}`}
                title={sectionTitle}
                detail={sectionDetail}
                isBig={isToday}
            />
        );
    }

    _contentsForSection(aids) {
        const assignments = aids.map(this.props.getAssignment);

        const groupings = _.groupBy(assignments, 'cid');

        const sortedEntries = _.sortBy(_.entries(groupings), '0');

        return sortedEntries.map(([cid, assignments]) => {
            const course = this.props.getCourse(cid);

            let subheader;

            if (course) {
                const courseName = course.nickname && course.nickname !== '' ? course.nickname : course.title;

                subheader = (
                    <ListSubheader classes={{ root: classes.subheader }} items={[courseName]} colors={[course.color]} />
                );
            }

            return (
                <React.Fragment key={cid}>
                    {subheader}
                    {assignments.map(({ aid }) => (
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
        });
    }

    render() {
        const sections = getSections(
            _.filter(this.props.assignments, this._shouldShowAssignment),
            this.state.showingPastAssignments
        );

        return (
            <div className="scrollable-list">
                <div className={`scroll-view ${classes.assignmentsList}`}>
                    <List className={classes.listContent}>
                        {sections.map(section => {
                            const [dueDate, aids] = section;
                            return (
                                <div className={classes.section} key={section[0]}>
                                    {this._headerForSection(dueDate)}
                                    {this._contentsForSection(aids)}
                                </div>
                            );
                        })}
                    </List>
                </div>
                <div className={classes.actionsBar}>
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    classes={{ root: classes.switch }}
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
                </div>
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
    getCourse: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getAssignmentsSelectors(state.assignments);

    return {
        getAssignment: selectors.selectById,
        shouldGoToAssignment: state.assignments.shouldGoToAssignment,
        assignments: selectors.selectAll(),
        getCourse: getCourseSelectors(state.schedule).selectById,
    };
};

const mapDispatchToProps = {
    fetchAssignments,
    deleteAssignment,
    setShouldGoToAssignment,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentsList);
