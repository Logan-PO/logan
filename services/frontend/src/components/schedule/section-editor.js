import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { Grid, Typography, TextField, Breadcrumbs, Divider } from '@material-ui/core';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import { getScheduleSelectors, updateSection, updateSectionLocal } from '@logan/fe-shared/store/schedule';
import Editor from '../shared/editor';
import DowPicker from '../shared/controls/dow-picker';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

function dateOrNull(input, format) {
    return input ? dayjs(input, format) : null;
}

class SectionEditor extends Editor {
    constructor(props) {
        super(props, { id: 'sid', entity: 'section' });

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            section: {},
        };
    }

    selectEntity(id) {
        return this.props.selectSection(id);
    }

    updateEntity(entity) {
        this.props.updateSection(entity);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateSectionLocal({ id, changes });
    }

    processChange(changes, prop, e) {
        if (prop === 'startDate' || prop === 'endDate') {
            changes[prop] = e.format(DB_DATE_FORMAT);
        } else if (prop === 'startTime' || prop === 'endTime') {
            changes[prop] = e.format(DB_TIME_FORMAT);
        } else if (prop === 'weeklyRepeat') {
            changes[prop] = Number(e.target.value);
        } else {
            super.processChange(changes, prop, e);
        }
    }

    render() {
        const course = this.props.selectCourse(_.get(this.state.section, 'cid'));
        const term = this.props.selectTerm(_.get(course, 'tid'));

        const startDate = dateOrNull(_.get(this.state.section, 'startDate'), DB_DATE_FORMAT);
        const endDate = dateOrNull(_.get(this.state.section, 'endDate'), DB_DATE_FORMAT);
        const startTime = dateOrNull(_.get(this.state.section, 'startTime'), DB_TIME_FORMAT);
        const endTime = dateOrNull(_.get(this.state.section, 'endTime'), DB_TIME_FORMAT);

        const termBreadcrumb = _.get(term, 'title');
        const courseBreadcrumb = !_.isEmpty(_.get(course, 'nickname')) ? course.nickname : _.get(course, 'title');

        return (
            <div className="editor">
                <div className="scroll-view">
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Breadcrumbs>
                                <Typography color="inherit">{termBreadcrumb}</Typography>
                                <Typography color="inherit">{courseBreadcrumb}</Typography>
                                <Typography color="textPrimary">Edit Section</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Divider flexItem style={{ margin: '0 -1em' }} />
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                disabled={this.isEmpty()}
                                label="Title"
                                value={_.get(this.state.section, 'title', '')}
                                onChange={this.handleChange.bind(this, 'title')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        disabled={this.isEmpty()}
                                        label="Instructor"
                                        value={_.get(this.state.section, 'instructor', '')}
                                        onChange={this.handleChange.bind(this, 'instructor')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        disabled={this.isEmpty()}
                                        label="Location"
                                        value={_.get(this.state.section, 'location', '')}
                                        onChange={this.handleChange.bind(this, 'location')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <DatePicker
                                        fullWidth
                                        label="Start Date"
                                        variant="inline"
                                        disabled={this.isEmpty()}
                                        color="secondary"
                                        value={startDate}
                                        onChange={this.handleChange.bind(this, 'startDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TimePicker
                                        fullWidth
                                        label="Start Time"
                                        variant="inline"
                                        disabled={this.isEmpty()}
                                        color="secondary"
                                        format="h:mm A"
                                        value={startTime}
                                        onChange={this.handleChange.bind(this, 'startTime')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <DatePicker
                                        fullWidth
                                        label="End Date"
                                        variant="inline"
                                        disabled={this.isEmpty()}
                                        color="secondary"
                                        value={endDate}
                                        onChange={this.handleChange.bind(this, 'endDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TimePicker
                                        fullWidth
                                        label="End Time"
                                        variant="inline"
                                        disabled={this.isEmpty()}
                                        color="secondary"
                                        format="h:mm A"
                                        value={endTime}
                                        onChange={this.handleChange.bind(this, 'endTime')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        type="number"
                                        inputProps={{ min: 1, max: 52 }}
                                        disabled={this.isEmpty()}
                                        label="Weekly Interval"
                                        fullWidth
                                        value={_.get(this.state.section, 'weeklyRepeat', '')}
                                        onChange={this.handleChange.bind(this, 'weeklyRepeat')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DowPicker
                                        fullWidth
                                        disabled={this.isEmpty()}
                                        value={_.get(this.state.section, 'daysOfWeek', [])}
                                        onChange={this.handleChange.bind(this, 'daysOfWeek')}
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

SectionEditor.propTypes = {
    tid: PropTypes.string,
    selectTerm: PropTypes.func,
    selectCourse: PropTypes.func,
    selectSection: PropTypes.func,
    updateSectionLocal: PropTypes.func,
    updateSection: PropTypes.func,
};

const mapStateToProps = state => {
    const { baseSelectors } = getScheduleSelectors(state.schedule);

    return {
        selectTerm: baseSelectors.terms.selectById,
        selectCourse: baseSelectors.courses.selectById,
        selectSection: baseSelectors.sections.selectById,
    };
};

const mapDispatchToProps = { updateSection, updateSectionLocal };

export default connect(mapStateToProps, mapDispatchToProps)(SectionEditor);
