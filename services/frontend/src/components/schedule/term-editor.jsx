import _ from 'lodash';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import Editor from 'packages/fe-shared/components/editor';
import { noProp } from 'packages/fe-shared/utils/misc';
import {
    getScheduleSelectors,
    updateTerm,
    updateTermLocal,
    deleteCourse,
    deleteHoliday,
} from 'packages/fe-shared/store/schedule';
import TextInput from '../shared/controls/text-input';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import Typography from '../shared/typography';
import InputGroup from '../shared/controls/input-group';
import '../shared/list.scss';
import '../shared/editor.scss';
import TextButton from '../shared/controls/text-button';
import editorStyles from './page-editor.module.scss';
import listStyles from './page-list.module.scss';
import CourseModal from './course-modal';
import HolidayModal from './holiday-modal';
import { dateUtils } from 'packages/core';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class TermEditor extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'term' });

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            showCourseModal: false,
            showHolidayModal: false,
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

    renderCoursesList() {
        const courses = this.isEmpty() ? [] : this.props.getCoursesForTerm({ tid: this.props.tid });

        return (
            <InputGroup
                label="Courses"
                content={
                    <div className={`small-list ${editorStyles.smallerList}`}>
                        {courses.map(course => (
                            <div
                                key={course.cid}
                                className={clsx('list-item', listStyles.cell, editorStyles.smallerCell)}
                                onClick={() => this.props.onSelectCourse(course.cid)}
                            >
                                <div className={listStyles.swatch} style={{ background: course.color }} />
                                <Typography>{course.title}</Typography>
                                <ChevronRightIcon fontSize="small" />
                                <div className="actions">
                                    <Tooltip title="Delete">
                                        <IconButton
                                            size="small"
                                            className="action"
                                            onClick={noProp(() => this.props.deleteCourse(course))}
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                        <TextButton
                            classes={{ root: listStyles.addButton }}
                            size="large"
                            IconComponent={AddIcon}
                            onClick={() => this.setState({ showCourseModal: true })}
                        >
                            Add course
                        </TextButton>
                    </div>
                }
            />
        );
    }

    renderHolidaysList() {
        const holidays = this.isEmpty() ? [] : this.props.getHolidaysForTerm({ tid: this.props.tid });

        return (
            <InputGroup
                label="Holidays"
                content={
                    <div className={`small-list ${editorStyles.smallerList}`}>
                        {holidays.map(holiday => (
                            <div
                                key={holiday.hid}
                                className={clsx('list-item', listStyles.cell, editorStyles.smallerCell)}
                                onClick={() => this.props.onSelectHoliday(holiday.hid)}
                            >
                                <Typography>{holiday.title}</Typography>
                                <ChevronRightIcon fontSize="small" />
                                <div className="actions">
                                    <Tooltip title="Delete">
                                        <IconButton
                                            size="small"
                                            className="action"
                                            onClick={noProp(() => this.props.deleteHoliday(holiday))}
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                        <TextButton
                            classes={{ root: listStyles.addButton }}
                            size="large"
                            IconComponent={AddIcon}
                            onClick={() => this.setState({ showHolidayModal: true })}
                        >
                            Add holiday
                        </TextButton>
                    </div>
                }
            />
        );
    }

    render() {
        const sd = _.get(this.state.term, 'startDate');
        const ed = _.get(this.state.term, 'endDate');

        const startDate = sd ? dayjs(sd, DB_DATE_FORMAT) : dayjs();
        const endDate = ed ? dayjs(ed, DB_DATE_FORMAT) : dayjs();

        return (
            <div className="editor">
                <div className={`scroll-view ${editorStyles.editor}`}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <TextInput
                                style={{ marginBottom: 16 }}
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
                                        labelFunc={date => date.format('MMM D, YYYY')}
                                        value={startDate}
                                        onChange={this.handleChange.bind(this, 'startDate')}
                                        hideIcon
                                        disabled={this.isEmpty()}
                                        inputGroupProps={{ label: 'Start Date' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <BasicDatePicker
                                        labelFunc={date => date.format('MMM D, YYYY')}
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
                                    {this.renderCoursesList()}
                                </Grid>
                                <Grid item xs={6}>
                                    {this.renderHolidaysList()}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <CourseModal
                    tid={this.state.term.tid}
                    open={this.state.showCourseModal}
                    onClose={() => this.setState({ showCourseModal: false })}
                />
                <HolidayModal
                    tid={this.state.term.tid}
                    open={this.state.showHolidayModal}
                    onClose={() => this.setState({ showHolidayModal: false })}
                />
            </div>
        );
    }
}

TermEditor.propTypes = {
    tid: PropTypes.string,
    selectTerm: PropTypes.func,
    updateTermLocal: PropTypes.func,
    updateTerm: PropTypes.func,
    deleteCourse: PropTypes.func,
    deleteHoliday: PropTypes.func,
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

const mapDispatchToProps = { updateTerm, updateTermLocal, deleteCourse, deleteHoliday };

export default connect(mapStateToProps, mapDispatchToProps)(TermEditor);
