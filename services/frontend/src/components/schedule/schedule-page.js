import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Page } from '../shared';
import { getScheduleSelectors, asyncActions as asyncScheduleActions } from '../../store/schedule';
import TermDisplay from './term-display';

class SchedulePage extends React.Component {
    constructor(props) {
        super(props);
        this.createNewTerm = this.createNewTerm.bind(this);
    }

    componentDidMount() {
        this.props.fetchSchedule();
    }

    createNewTerm() {
        this.props.createTerm({
            title: 'New term',
            startDate: '2020-1-1',
            endDate: '2020-1-1',
        });
    }

    render() {
        return (
            <Page title="Schedule">
                <b>Terms</b>
                <ul>
                    {this.props.tids.map(tid => (
                        <TermDisplay tid={tid} key={tid} />
                    ))}
                    <li>
                        <button onClick={this.createNewTerm}>New Term</button>
                    </li>
                </ul>
            </Page>
        );
    }
}

SchedulePage.propTypes = {
    tids: PropTypes.array,
    fetchSchedule: PropTypes.func,
    createTerm: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        tids: selectors.baseSelectors.terms.selectIds(),
    };
};

const mapDispatchToProps = {
    ...asyncScheduleActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
