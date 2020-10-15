import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Page } from '../shared';
import { fetchSchedule } from '../../store/schedule';

class SchedulePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchSchedule();
    }

    render() {
        return (
            <Page title="Schedule">Schedule</Page>
        );
    }
}

SchedulePage.propTypes = {
    fetchSchedule: PropTypes.func,
};

const mapDispatchToProps = { fetchSchedule };

export default connect(null, mapDispatchToProps)(SchedulePage);
