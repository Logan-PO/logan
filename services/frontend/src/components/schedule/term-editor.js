import _ from 'lodash';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import Grid from '@material-ui/core/Grid';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { getScheduleSelectors, updateTerm, updateTermLocal } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import TextInput from '../shared/controls/text-input';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import Typography from '../shared/typography';
import InputGroup from '../shared/controls/input-group';
import '../shared/editor.scss';
import editorStyles from './page-editor.module.scss';
import listStyles from './page-list.module.scss';
import styles from './term-editor.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

const CourseCell = ({ course, ...rest }) => (
    <div className={clsx(listStyles.cell, styles.courseCell)} {...rest}>
        <div className={styles.swatch} style={{ background: course.color }} />
        <Typography>{course.title}</Typography>
        <ChevronRightIcon fontSize="small" />
    </div>
);

CourseCell.propTypes = {
    course: PropTypes.object,
};

const HolidayCell = ({ holiday, ...rest }) => (
    <div className={clsx(listStyles.cell, styles.courseCell)} {...rest}>
        <Typography>{holiday.title}</Typography>
        <ChevronRightIcon fontSize="small" />
    </div>
);

HolidayCell.propTypes = {
    holiday: PropTypes.object,
};

class TermEditor extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'term' });

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            term: {},
        };
    }

    selectEntity(id) {
        return this.props.selectTerm(id);
    }

    updateEntity(entity) {
        this.props.updateTerm(entity);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateTermLocal({ id, changes });
    }

    processChange(changes, prop, e) {
        if (prop === 'startDate' || prop === 'endDate') {
            changes[prop] = e.format(DB_DATE_FORMAT);
        } else {
            super.processChange(changes, prop, e);
        }
    }

    render() {
        const sd = _.get(this.state.term, 'startDate');
        const ed = _.get(this.state.term, 'endDate');

        const startDate = sd ? dayjs(sd, DB_DATE_FORMAT) : dayjs();
        const endDate = ed ? dayjs(ed, DB_DATE_FORMAT) : dayjs();

        const courses = this.isEmpty() ? [] : this.props.getCoursesForTerm({ tid: this.props.tid });
        const holidays = this.isEmpty() ? [] : this.props.getHolidaysForTerm({ tid: this.props.tid });

        return (
            <div className="editor">
                <div className={`scroll-view ${editorStyles.editor}`}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <TextInput
                                variant="big-input"
                                fullWidth
                                value={_.get(this.state.term, 'title', '')}
                                onChange={this.handleChange.bind(this, 'title')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <BasicDatePicker
                                        value={startDate}
                                        onChange={this.handleChange.bind(this, 'startDate')}
                                        hideIcon
                                        disabled={this.isEmpty()}
                                        inputGroupProps={{ label: 'Start Date' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <BasicDatePicker
                                        value={endDate}
                                        onChange={this.handleChange.bind(this, 'endDate')}
                                        hideIcon
                                        disabled={this.isEmpty()}
                                        inputGroupProps={{ label: 'End Date' }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <InputGroup
                                        label="Courses"
                                        content={
                                            <div className={styles.coursesList}>
                                                {courses.map(course => (
                                                    <CourseCell
                                                        key={course.cid}
                                                        course={course}
                                                        onClick={() => this.props.onSelectCourse(course.cid)}
                                                    />
                                                ))}
                                            </div>
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputGroup
                                        label="Holidays"
                                        content={
                                            <div className={styles.coursesList}>
                                                {holidays.map(holiday => (
                                                    <HolidayCell
                                                        key={holiday.hid}
                                                        holiday={holiday}
                                                        onClick={() => this.props.onSelectHoliday(holiday.hid)}
                                                    />
                                                ))}
                                            </div>
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

TermEditor.propTypes = {
    tid: PropTypes.string,
    selectTerm: PropTypes.func,
    updateTermLocal: PropTypes.func,
    updateTerm: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    getHolidaysForTerm: PropTypes.func,
    onSelectCourse: PropTypes.func,
    onSelectHoliday: PropTypes.func,
};

const mapStateToProps = state => {
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    return {
        selectTerm: scheduleSelectors.baseSelectors.terms.selectById,
        getCoursesForTerm: scheduleSelectors.getCoursesForTerm,
        getHolidaysForTerm: scheduleSelectors.getHolidaysForTerm,
    };
};

const mapDispatchToProps = { updateTerm, updateTermLocal };

export default connect(mapStateToProps, mapDispatchToProps)(TermEditor);
