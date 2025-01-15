import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Tooltip, IconButton } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DeleteIcon from '@material-ui/icons/Delete';
import { getScheduleSelectors, createSection, deleteSection } from 'packages/fe-shared/store/schedule';
import TextButton from '../shared/controls/text-button';
import '../shared/list.scss';
import ListHeader from '../shared/list-header';
import ListSubheader from '../shared/list-subheader';
import Typography from '../shared/typography';
import Fab from '../shared/controls/fab';
import SectionModal from './section-modal';
import styles from './page-list.module.scss';

class SectionsList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectSection = this.didSelectSection.bind(this);
        this.didDeleteSection = this.didDeleteSection.bind(this);

        this.state = {
            sectionModalOpen: false,
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
        this.props.onSectionSelected(sid);
    }

    didDeleteSection(section) {
        this.props.deleteSection(section);
        // TODO: Select next section
        this.didSelectSection(undefined);
    }

    listItems() {
        const sections = this.props.getSectionsForCourse({ cid: this.props.cid });

        return sections.map(section => {
            const isSelected = section.sid === this.props.selectedSid;

            return (
                <div
                    key={section.sid}
                    className={clsx('list-cell', styles.cell, isSelected && styles.selected)}
                    onClick={() => this.didSelectSection(section.sid)}
                >
                    <Typography>{section.title}</Typography>
                    <div className={`actions ${styles.actions}`}>
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                className={styles.action}
                                onClick={() => this.didDeleteSection(section)}
                            >
                                <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            );
        });
    }

    render() {
        const course = this.props.getCourse(this.props.cid);
        const term = this.props.getTerm((course || {}).tid);

        return (
            <div className="scrollable-list">
                <div className={`scroll-view ${styles.listContainer}`}>
                    <List className={styles.listContent}>
                        <TextButton
                            size="large"
                            classes={{ root: styles.backButton }}
                            IconComponent={ChevronLeftIcon}
                            color="textSecondary"
                            onClick={this.props.onBackPressed}
                        >
                            {term.title}
                        </TextButton>
                        <ListHeader title={course.title} className={styles.header} isBig disableDivider />
                        <ListSubheader
                            classes={{ root: styles.subheader }}
                            items={['SECTIONS']}
                            colors={['textPrimary']}
                            showHorizontalDivider
                        />
                        {this.listItems()}
                    </List>
                </div>
                <Fab className="add-button" onClick={() => this.setState({ sectionModalOpen: true })} />
                <SectionModal
                    tid={_.get(term, 'tid')}
                    cid={this.props.cid}
                    open={this.state.sectionModalOpen}
                    onClose={() => this.setState({ sectionModalOpen: false })}
                />
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
    onBackPressed: PropTypes.func,
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
