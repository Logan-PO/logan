import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { DatePicker } from '@material-ui/pickers';
import { getScheduleSelectors, updateHolidayLocal, updateHoliday, deleteHoliday } from '../../store/schedule';
import { getChanges } from './change-processor';

const { dayjs, constants: dateConstants } = dateUtils;

class HolidayDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.actuallyMakeUpdates = this.actuallyMakeUpdates.bind(this);
        this.del = this.del.bind(this);

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

        if (prop === 'startDate' || prop === 'endDate') {
            changes[prop] = e.format(dateConstants.DB_DATE_FORMAT);
        } else {
            changes[prop] = e.target.value;
        }

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
        this.props.deleteSelf({ hid: this.props.eid });
    }

    render() {
        const changesExist = !_.isEmpty(getChanges(this.props.getEntity(this.props.eid), this.state.entity));

        return (
            <li>
                <input
                    type="text"
                    value={_.get(this.state.entity, 'title', '')}
                    onChange={this.handleChange.bind(this, 'title')}
                />
                <DatePicker
                    variant="inline"
                    label="Start"
                    value={dayjs(_.get(this.state.entity, 'startDate'), dateConstants.DB_DATE_FORMAT)}
                    onChange={this.handleChange.bind(this, 'startDate')}
                />
                <DatePicker
                    variant="inline"
                    label="End"
                    value={dayjs(_.get(this.state.entity, 'endDate'), dateConstants.DB_DATE_FORMAT)}
                    onChange={this.handleChange.bind(this, 'endDate')}
                />
                <button onClick={this.actuallyMakeUpdates} disabled={!changesExist}>
                    Save
                </button>
                <button onClick={this.del}>Delete</button>
            </li>
        );
    }
}

HolidayDisplay.propTypes = {
    eid: PropTypes.string,
    getEntity: PropTypes.func,
    updateSelfLocal: PropTypes.func,
    updateSelf: PropTypes.func,
    deleteSelf: PropTypes.func,
};

const mapStateToProps = state => ({
    getEntity: getScheduleSelectors(state.schedule).baseSelectors.holidays.selectById,
});

const mapDispatchToProps = {
    updateSelfLocal: updateHolidayLocal,
    updateSelf: updateHoliday,
    deleteSelf: deleteHoliday,
};

export default connect(mapStateToProps, mapDispatchToProps)(HolidayDisplay);
