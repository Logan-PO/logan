import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Fab,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { getScheduleSelectors, createSection, deleteSection } from '../../store/schedule';
import '../shared/list.scss';

class SectionsList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectSection = this.didSelectSection.bind(this);
        this.didDeleteSection = this.didDeleteSection.bind(this);

        this.state = {
            selectedSid: undefined,
        };
    }

    randomSection() {
        const course = this.props.getCourse(this.props.cid);
        const term = this.props.getTerm(course.tid);

        return {
            title: 'New section',
            cid: this.props.cid,
            tid: course.tid,
            startDate: term.startDate,
            endDate: term.endDate,
            startTime: '08:00',
            endTime: '09:00',
            daysOfWeek: [1, 3, 5],
            weeklyRepeat: 1,
        };
    }

    didSelectSection(sid) {
        this.setState(() => ({ selectedSid: sid }));
        this.props.onSectionSelected(sid);
    }

    didDeleteSection(section) {
        this.props.deleteSection(section);
        // TODO: Select next section
        this.didSelectSection(undefined);
    }

    render() {
        const sections = this.props.getSectionsForCourse({ cid: this.props.cid });

        return (
            <div className="scrollable-list">
                <div className="scroll-view">
                    <List>
                        <ListSubheader>Sections</ListSubheader>
                        {sections.map(section => {
                            const isSelected = section.sid === this.state.selectedSid;

                            return (
                                <div key={section.sid} className="list-cell">
                                    <ListItem
                                        button
                                        selected={isSelected}
                                        onClick={() => this.didSelectSection(section.sid)}
                                    >
                                        <ListItemText primary={section.title} />
                                        <ListItemSecondaryAction className="actions">
                                            <IconButton edge="end" onClick={() => this.didDeleteSection(section)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </div>
                <Fab
                    className="add-button"
                    color="secondary"
                    onClick={() => this.props.createTerm(this.randomSection())}
                >
                    <AddIcon />
                </Fab>
            </div>
        );
    }
}

SectionsList.propTypes = {
    cid: PropTypes.string,
    getTerm: PropTypes.func,
    getCourse: PropTypes.func,
    getSectionsForCourse: PropTypes.func,
    createTerm: PropTypes.func,
    deleteSection: PropTypes.func,
    onSectionSelected: PropTypes.func,
};

const mapStateToProps = state => {
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    return {
        getTerm: scheduleSelectors.baseSelectors.terms.selectById,
        getCourse: scheduleSelectors.baseSelectors.courses.selectById,
        getSectionsForCourse: scheduleSelectors.getSectionsForCourse,
    };
};

const mapDispatchToProps = { createSection, deleteSection };

export default connect(mapStateToProps, mapDispatchToProps)(SectionsList);
