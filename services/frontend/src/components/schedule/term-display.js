import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { getScheduleSelectors, asyncActions, updateTermLocal } from '../../store/schedule';
import { getChanges } from './change-processor';
import HolidayDisplay from './holiday-display';
import CourseDisplay from './course-display';

const { dayjs, constants: dateConstants } = dateUtils;

class TermDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.actuallyMakeUpdates = this.actuallyMakeUpdates.bind(this);
        this.deleteSelf = this.deleteSelf.bind(this);
        this.createNewHoliday = this.createNewHoliday.bind(this);
        this.createNewCourse = this.createNewCourse.bind(this);

        this.state = {
            term: this.props.tid ? this.props.getTerm(this.props.tid) : undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            this.setState({
                term: this.props.getTerm(this.props.tid),
            });
        }
    }

    handleChange(prop, e) {
        const changes = {};

        if (prop === 'startDate' || prop === 'endDate') {
            const dateString = e.target.value;
            const dateObj = dayjs(dateString, 'YYYY-MM-DD');
            changes[prop] = dateObj.format(dateConstants.DB_DATE_FORMAT);
        } else {
            changes[prop] = e.target.value;
        }

        this.setState({
            term: _.merge({}, this.state.term, changes),
        });
    }

    actuallyMakeUpdates() {
        const changes = getChanges(this.props.getTerm(this.props.tid), this.state.term);

        this.props.updateTermLocal({
            id: this.props.tid,
            changes,
        });

        this.props.updateTerm(this.state.term);
    }

    deleteSelf() {
        this.props.deleteTerm({ tid: this.props.tid });
    }

    createNewHoliday() {
        this.props.createHoliday({
            tid: this.props.tid,
            title: 'New holiday',
            startDate: '2020-1-1',
            endDate: '2021-1-1',
        });
    }

    createNewCourse() {
        this.props.createCourse({
            tid: this.props.tid,
            title: 'New course',
            color: '#000000',
        });
    }

    render() {
        const changesExist = !_.isEmpty(getChanges(this.props.getTerm(this.props.tid), this.state.term));

        return (
            <li>
                <div>
                    <input
                        type="text"
                        value={_.get(this.state.term, 'title', '')}
                        onChange={this.handleChange.bind(this, 'title')}
                    />
                    <input
                        type="date"
                        value={dayjs(_.get(this.state.term, 'startDate')).format('YYYY-MM-DD')}
                        onChange={this.handleChange.bind(this, 'startDate')}
                    />
                    <input
                        type="date"
                        value={dayjs(_.get(this.state.term, 'endDate')).format('YYYY-MM-DD')}
                        onChange={this.handleChange.bind(this, 'endDate')}
                    />
                    <button onClick={this.actuallyMakeUpdates} disabled={!changesExist}>
                        Save
                    </button>
                    <button onClick={this.deleteSelf}>Delete</button>
                </div>
                <div>
                    <b>Holidays</b>
                    <ul>
                        {this.props.hids.map(hid => (
                            <HolidayDisplay eid={hid} key={hid} />
                        ))}
                        <li>
                            <button onClick={this.createNewHoliday}>New holiday</button>
                        </li>
                    </ul>
                </div>
                <div>
                    <b>Courses</b>
                    <ul>
                        {this.props.cids.map(cid => (
                            <CourseDisplay eid={cid} key={cid} />
                        ))}
                        <li>
                            <button onClick={this.createNewCourse}>New course</button>
                        </li>
                    </ul>
                </div>
            </li>
        );
    }
}

TermDisplay.propTypes = {
    tid: PropTypes.string,
    hids: PropTypes.array,
    cids: PropTypes.array,
    getTerm: PropTypes.func,
    updateTermLocal: PropTypes.func,
    updateTerm: PropTypes.func,
    deleteTerm: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    getHolidaysForTerm: PropTypes.func,
    createHoliday: PropTypes.func,
    createCourse: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    return {
        ...scheduleSelectors,
        getTerm: scheduleSelectors.baseSelectors.terms.selectById,
        hids: _.map(scheduleSelectors.getHolidaysForTerm({ tid: ownProps.tid }), 'hid'),
        cids: _.map(scheduleSelectors.getCoursesForTerm({ tid: ownProps.tid }), 'cid'),
    };
};

const mapDispatchToProps = { updateTermLocal, ...asyncActions };

export default connect(mapStateToProps, mapDispatchToProps)(TermDisplay);
