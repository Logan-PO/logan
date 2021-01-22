import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, IconButton, Tooltip } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    getScheduleSelectors,
    createCourse,
    deleteCourse,
    createHoliday,
    deleteHoliday,
} from '@logan/fe-shared/store/schedule';
import '../shared/list.scss';
import ListHeader from '../shared/list-header';
import TextButton from '../shared/controls/text-button';
import ListSubheader from '../shared/list-subheader';
import Typography from '../shared/typography';
import Fab from '../shared/controls/fab';
import styles from './page-list.module.scss';

class TermChildrenList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectChild = this.didSelectChild.bind(this);
        this.didDeleteChild = this.didDeleteChild.bind(this);
    }

    randomChild(type) {
        if (type === 'course') {
            return {
                tid: this.props.tid,
                title: 'New course',
                color: '#000000',
            };
        } else if (type === 'holiday') {
            return {
                tid: this.props.tid,
                title: 'New holiday',
                startDate: '2020-01-01',
                endDate: '2020-01-02',
            };
        }
    }

    didSelectChild(type, id) {
        if (type === 'course') {
            this.props.onCourseSelected(id);
        } else if (type === 'holiday') {
            this.props.onHolidaySelected(id);
        }
    }

    didDeleteChild(type, child) {
        if (type === 'course') {
            this.props.deleteCourse(child);
        } else if (type === 'holiday') {
            this.props.deleteHoliday(child);
        }

        this.didSelectChild(type, undefined);
    }

    getCoursesList() {
        const courses = this.props.getCoursesForTerm({ tid: this.props.tid });

        return courses.map(course => {
            const isSelected = course.cid === this.props.selectedId;

            return (
                <div
                    key={course.cid}
                    className={clsx('list-cell', styles.cell, isSelected && styles.selected)}
                    onClick={() => this.didSelectChild('course', course.cid)}
                >
                    <div className={styles.swatch} style={{ background: course.color }} />
                    <Typography>{course.title}</Typography>
                    <div className={`actions ${styles.actions}`}>
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                className={styles.action}
                                onClick={() => this.didDeleteChild('course', course)}
                            >
                                <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            );
        });
    }

    getHolidaysList() {
        const holidays = this.props.getHolidaysForTerm({ tid: this.props.tid });

        return holidays.map(holiday => {
            const isSelected = holiday.hid === this.props.selectedId;

            return (
                <div
                    key={holiday.hid}
                    className={clsx('list-cell', styles.cell, isSelected && styles.selected)}
                    onClick={() => this.didSelectChild('holiday', holiday.hid)}
                >
                    <Typography>{holiday.title}</Typography>
                    <div className={`actions ${styles.actions}`}>
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                className={styles.action}
                                onClick={() => this.didDeleteChild('holiday', holiday)}
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
        const term = this.props.getTerm(this.props.tid);

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
                            All terms
                        </TextButton>
                        <ListHeader title={term.title} className={styles.header} isBig disableDivider />
                        <ListSubheader
                            className={styles.subheader}
                            items={['COURSES']}
                            colors={['textPrimary']}
                            showHorizontalDivider
                        />
                        {this.getCoursesList()}
                        <ListSubheader
                            className={styles.subheader}
                            items={['HOLIDAYS']}
                            colors={['textPrimary']}
                            showHorizontalDivider
                        />
                        {this.getHolidaysList()}
                    </List>
                </div>
                {/* TODO: Add create modals, and FabGroup! */}
                <Fab className="add-button" />
            </div>
        );
    }
}

TermChildrenList.propTypes = {
    tid: PropTypes.string,
    onBackPressed: PropTypes.func,
    selectedId: PropTypes.string,
    getTerm: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    getHolidaysForTerm: PropTypes.func,
    onCourseSelected: PropTypes.func,
    onHolidaySelected: PropTypes.func,
    createCourse: PropTypes.func,
    createHoliday: PropTypes.func,
    deleteCourse: PropTypes.func,
    deleteHoliday: PropTypes.func,
};

const mapStateToProps = state => {
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    return {
        getTerm: scheduleSelectors.baseSelectors.terms.selectById,
        ...scheduleSelectors,
    };
};

const mapDispatchToProps = { createCourse, deleteCourse, createHoliday, deleteHoliday };

export default connect(mapStateToProps, mapDispatchToProps)(TermChildrenList);
