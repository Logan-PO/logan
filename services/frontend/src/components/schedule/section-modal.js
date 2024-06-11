import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from '@logan/core';
import { createSection, getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import CircularProgress from '@material-ui/core/CircularProgress';
import InstructorIcon from '@material-ui/icons/Face';
import LocationIcon from '@material-ui/icons/LocationOn';
import WeeklyIcon from '@material-ui/icons/ViewWeek';
import Dialog from '../shared/dialog';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import ActionButton from '../shared/controls/action-button';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import DowPicker from '../shared/controls/dow-picker';
import TimePicker from '../shared/controls/time-picker';
import editorStyles from './page-editor.module.scss';

function dateOrNull(input, format) {
    return input ? dateUtils.dayjs(input, format) : dateUtils.dayjs();
}

class SectionModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createSection = this.createSection.bind(this);

        this._titleRef = React.createRef();

        const term = props.getTerm(props.tid) || {};

        this.state = {
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: false,
            section: {
                tid: props.tid,
                cid: props.cid,
                startDate: term.startDate || dateUtils.formatAsDate(),
                endDate: term.endDate || dateUtils.formatAsDate(),
                startTime: dateUtils.formatAsTime(),
                endTime: dateUtils.formatAsTime(),
                weeklyRepeat: 1,
                daysOfWeek: [],
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.componentWillOpen();
        } else if (this.state.justOpened) {
            this.componentDidOpen();
        }
    }

    componentWillOpen() {
        const term = this.props.getTerm(this.props.tid) || {};

        this.setState({
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: true,
            section: {
                tid: this.props.tid,
                cid: this.props.cid,
                startDate: term.startDate || dateUtils.formatAsDate(),
                endDate: term.endDate || dateUtils.formatAsDate(),
                startTime: dateUtils.formatAsTime(),
                endTime: dateUtils.formatAsTime(),
                weeklyRepeat: 1,
                daysOfWeek: [],
            },
        });
    }

    componentDidOpen() {
        this._titleRef.current && this._titleRef.current.select();
        this.setState({ justOpened: false });
    }

    close() {
        this.props.onClose();
    }

    handleChange(prop, e) {
        const section = this.state.section;

        if (prop === 'startDate' || prop === 'endDate') {
            section[prop] = dateUtils.formatAsDate(e);
        } else if (prop === 'startTime' || prop === 'endTime') {
            section[prop] = dateUtils.formatAsTime(e);
        } else if (prop === 'weeklyRepeat') {
            section[prop] = Number(e.target.value);
        } else {
            section[prop] = e.target.value;
        }

        this.setState({ section });
    }

    async createSection() {
        this.setState({ isCreating: true });
        const timeout = setTimeout(() => this.setState({ showLoader: true }), 500);
        await this.props.createSection(this.state.section);
        clearTimeout(timeout);
        this.setState({ showLoader: false, isCreating: false });
        this.close();
    }

    render() {
        const startDate = dateOrNull(_.get(this.state.section, 'startDate'), dateUtils.constants.DB_DATE_FORMAT);
        const endDate = dateOrNull(_.get(this.state.section, 'endDate'), dateUtils.constants.DB_DATE_FORMAT);
        const startTime = dateOrNull(_.get(this.state.section, 'startTime'), dateUtils.constants.DB_TIME_FORMAT);
        const endTime = dateOrNull(_.get(this.state.section, 'endTime'), dateUtils.constants.DB_TIME_FORMAT);

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
                title="New section"
                cancelTitle="Cancel"
                content={
                    <React.Fragment>
                        <InputGroup
                            label="Title"
                            content={
                                <TextInput
                                    style={{ marginBottom: 16 }}
                                    variant="big-input"
                                    placeholder="New section"
                                    fullWidth
                                    value={_.get(this.state.section, 'title', '')}
                                    onChange={this.handleChange.bind(this, 'title')}
                                    inputRef={this._titleRef}
                                />
                            }
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
                                    value={_.get(this.state.section, 'daysOfWeek', [])}
                                    onChange={this.handleChange.bind(this, 'daysOfWeek')}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                }
                actions={
                    !this.state.showLoader ? (
                        <ActionButton onClick={this.createSection} disabled={this.state.showLoader}>
                            Create
                        </ActionButton>
                    ) : (
                        <CircularProgress size={24} />
                    )
                }
            />
        );
    }
}

SectionModal.propTypes = {
    tid: PropTypes.string.isRequired,
    cid: PropTypes.string.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    createSection: PropTypes.func,
    getCourse: PropTypes.func,
    getTerm: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule).baseSelectors;

    return {
        getCourse: selectors.courses.selectById,
        getTerm: selectors.terms.selectById,
    };
};

const mapDispatchToProps = {
    createSection,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionModal);
