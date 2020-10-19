import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getScheduleSelectors, updateCourseLocal, asyncActions } from '../../store/schedule';
import { getChanges } from './change-processor';
import SectionDisplay from './section-display';

class CourseDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.actuallyMakeUpdates = this.actuallyMakeUpdates.bind(this);
        this.del = this.del.bind(this);
        this.createNewSection = this.createNewSection.bind(this);

        this.state = {
            entity: this.props.eid ? this.props.getEntity(this.props.eid) : undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.eid !== prevProps.eid) {
            this.setState({
                entity: this.props.getEntity(this.props.eid),
            });
        }
    }

    handleChange(prop, e) {
        const changes = {};

        changes[prop] = e.target.value;

        this.setState({
            entity: _.merge({}, this.state.entity, changes),
        });
    }

    actuallyMakeUpdates() {
        const changes = getChanges(this.props.getEntity(this.props.eid), this.state.entity);

        this.props.updateSelfLocal({
            id: this.props.eid,
            changes,
        });

        this.props.updateSelf(this.state.entity);
    }

    del() {
        this.props.deleteSelf({ cid: this.props.eid });
    }

    createNewSection() {
        const term = this.props.getTerm(this.state.entity.tid);

        this.props.createSection({
            tid: this.state.entity.tid,
            cid: this.props.eid,
            title: 'New section',
            startDate: term.startDate,
            endDate: term.endDate,
            startTime: '08:00',
            endTime: '09:00',
            daysOfWeek: [1, 3, 5],
            weeklyRepeat: 1,
        });
    }

    render() {
        const changesExist = !_.isEmpty(getChanges(this.props.getEntity(this.props.eid), this.state.entity));

        return (
            <li>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={_.get(this.state.entity, 'title', '')}
                        onChange={this.handleChange.bind(this, 'title')}
                    />
                    <input
                        type="text"
                        placeholder="Nickname"
                        value={_.get(this.state.entity, 'nickname', '')}
                        onChange={this.handleChange.bind(this, 'nickname')}
                    />
                    <input
                        type="color"
                        value={_.get(this.state.entity, 'color', '')}
                        onChange={this.handleChange.bind(this, 'color')}
                    />
                    <button onClick={this.actuallyMakeUpdates} disabled={!changesExist}>
                        Save
                    </button>
                    <button onClick={this.del}>Delete</button>
                </div>
                <div>
                    <b>Sections</b>
                    <ul>
                        {this.props.sids.map(sid => (
                            <SectionDisplay eid={sid} key={sid} />
                        ))}
                        <li>
                            <button onClick={this.createNewSection}>New section</button>
                        </li>
                    </ul>
                </div>
            </li>
        );
    }
}

CourseDisplay.propTypes = {
    eid: PropTypes.string,
    getEntity: PropTypes.func,
    getTerm: PropTypes.func,
    updateSelfLocal: PropTypes.func,
    updateSelf: PropTypes.func,
    deleteSelf: PropTypes.func,
    getSectionsForCourse: PropTypes.func,
    createSection: PropTypes.func,
    sids: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
    const scheduleSelectors = getScheduleSelectors(state.schedule);
    return {
        getEntity: scheduleSelectors.baseSelectors.courses.selectById,
        getTerm: scheduleSelectors.baseSelectors.terms.selectById,
        sids: _.map(scheduleSelectors.getSectionsForCourse({ cid: ownProps.eid }), 'sid'),
        ...scheduleSelectors,
    };
};

const mapDispatchToProps = {
    updateSelfLocal: updateCourseLocal,
    updateSelf: asyncActions.updateCourse,
    deleteSelf: asyncActions.deleteCourse,
    createSection: asyncActions.createSection,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDisplay);
