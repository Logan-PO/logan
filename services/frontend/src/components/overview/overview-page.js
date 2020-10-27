import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page } from '../shared';
import { fetchAssignments } from '../../store/assignments';
import OverviewScheduleList from './overview-schedule-list';

export class OverviewPage extends React.Component {
    constructor(props) {
        super(props);
        this.didSelectAssignment = this.didSelectAssignment.bind(this);

        this.state = {
            selectedAid: undefined,
        };
    }

    componentDidMount() {
        this.props.fetchAssignments();
    }

    didSelectAssignment(aid) {
        this.setState({ selectedAid: aid });
    }
    render() {
        //possible source of error here
        return (
            <Page title="Overview">
                <OverviewScheduleList />
            </Page>
        );
    }
}

OverviewPage.propTypes = {
    fetchAssignments: PropTypes.func,
};

const mapDispatchToProps = { fetchAssignments };

export default connect(null, mapDispatchToProps)(OverviewPage);
