import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { getScheduleSelectors, createSection, deleteSection } from '@logan/fe-shared/store/schedule';
import '../shared/list.scss';
import EmptySticker from '../shared/displays/empty-sticker';

class SectionsList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectSection = this.didSelectSection.bind(this);
        this.didDeleteSection = this.didDeleteSection.bind(this);
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
        this.props.onSectionSelected(sid);
    }

    didDeleteSection(section) {
        this.props.deleteSection(section);
        // TODO: Select next section
        this.didSelectSection(undefined);
    }

    listItems() {
        const sections = this.props.getSectionsForCourse({ cid: this.props.cid });

        return [
            ...sections.map(section => {
                const isSelected = section.sid === this.props.selectedSid;

                return (
                    <div key={section.sid} className="list-cell">
                        <ListItem button selected={isSelected} onClick={() => this.didSelectSection(section.sid)}>
                            <ListItemText primary={section.title} />
                            <ListItemSecondaryAction className="actions">
                                <IconButton edge="end" onClick={() => this.didDeleteSection(section)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </div>
                );
            }),
            <ListItem button key="new" onClick={() => this.props.createSection(this.randomSection())}>
                <ListItemText
                    primary={
                        <a style={{ display: 'flex', alignItems: 'center' }}>
                            <AddIcon style={{ marginRight: '0.5rem' }} fontSize="small" />
                            New section
                        </a>
                    }
                    primaryTypographyProps={{ color: 'primary' }}
                />
            </ListItem>,
        ];
    }

    render() {
        if (!this.props.cid) {
            return (
                <div className="scrollable-list">
                    <EmptySticker message="No course selected" />
                </div>
            );
        }

        return (
            <div className="scrollable-list">
                <div className="scroll-view">
                    <List>
                        <ListSubheader className="list-header">Sections</ListSubheader>
                        {this.listItems()}
                    </List>
                </div>
            </div>
        );
    }
}

SectionsList.propTypes = {
    cid: PropTypes.string,
    selectedSid: PropTypes.string,
    getTerm: PropTypes.func,
    getCourse: PropTypes.func,
    getSectionsForCourse: PropTypes.func,
    createSection: PropTypes.func,
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
