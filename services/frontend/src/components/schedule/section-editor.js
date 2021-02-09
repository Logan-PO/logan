import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import InstructorIcon from '@material-ui/icons/Face';
import LocationIcon from '@material-ui/icons/LocationOn';
import WeeklyIcon from '@material-ui/icons/ViewWeek';
import { getScheduleSelectors, updateSection, updateSectionLocal } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import '../shared/editor.scss';
import DowPicker from '../shared/controls/dow-picker';
import TextInput from '../shared/controls/text-input';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import InputGroup from '../shared/controls/input-group';
import TimePicker from '../shared/controls/time-picker';
import editorStyles from './page-editor.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

function dateOrNull(input, format) {
    return input ? dayjs(input, format) : dayjs();
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
        const startDate = dateOrNull(_.get(this.state.section, 'startDate'), DB_DATE_FORMAT);
        const endDate = dateOrNull(_.get(this.state.section, 'endDate'), DB_DATE_FORMAT);
        const startTime = dateOrNull(_.get(this.state.section, 'startTime'), DB_TIME_FORMAT);
        const endTime = dateOrNull(_.get(this.state.section, 'endTime'), DB_TIME_FORMAT);

        return (
            <div className="editor">
                <div className={`scroll-view ${editorStyles.editor}`}>
                    <TextInput
                        style={{ marginBottom: 16 }}
                        variant="big-input"
                        placeholder="Section title"
                        value={_.get(this.state.section, 'title', '')}
                        onChange={this.handleChange.bind(this, 'title')}
                    />
                    <div className={editorStyles.twoCol}>
                        <div className={editorStyles.column}>
                            <BasicDatePicker
                                labelFunc={date => date.format('MMM D, YYYY')}
                                inputGroupProps={{ label: 'Start date' }}
                                value={startDate}
                                onChange={this.handleChange.bind(this, 'startDate')}
                            />
                        </div>
                        <div className={editorStyles.column}>
                            <TimePicker
                                label="Start time"
                                value={startTime}
                                onChange={this.handleChange.bind(this, 'startTime')}
                            />
                        </div>
                    </div>
                    <div className={editorStyles.twoCol}>
                        <div className={editorStyles.column}>
                            <BasicDatePicker
                                labelFunc={date => date.format('MMM D, YYYY')}
                                inputGroupProps={{ label: 'End date' }}
                                value={endDate}
                                onChange={this.handleChange.bind(this, 'endDate')}
                            />
                        </div>
                        <div className={editorStyles.column}>
                            <TimePicker
                                label="End time"
                                value={endTime}
                                onChange={this.handleChange.bind(this, 'endTime')}
                            />
                        </div>
                    </div>
                    <div className={editorStyles.twoCol}>
                        <div className={editorStyles.column}>
                            <InputGroup
                                label="Location"
                                icon={LocationIcon}
                                content={
                                    <TextInput
                                        placeholder="None"
                                        value={_.get(this.state.section, 'location')}
                                        onChange={this.handleChange.bind(this, 'location')}
                                    />
                                }
                            />
                        </div>
                        <div className={editorStyles.column}>
                            <InputGroup
                                label="Instructor"
                                icon={InstructorIcon}
                                content={
                                    <TextInput
                                        placeholder="None"
                                        value={_.get(this.state.section, 'instructor')}
                                        onChange={this.handleChange.bind(this, 'instructor')}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className={editorStyles.twoCol}>
                        <div className={editorStyles.column}>
                            <InputGroup
                                label="Weekly Interval"
                                icon={WeeklyIcon}
                                content={
                                    <TextInput
                                        type="number"
                                        value={_.get(this.state.section, 'weeklyRepeat')}
                                        onChange={this.handleChange.bind(this, 'weeklyRepeat')}
                                    />
                                }
                            />
                        </div>
                        <div className={editorStyles.column}>
                            <DowPicker
                                disabled={this.isEmpty()}
                                value={_.get(this.state.section, 'daysOfWeek', [])}
                                onChange={this.handleChange.bind(this, 'daysOfWeek')}
                            />
                        </div>
                    </div>
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
