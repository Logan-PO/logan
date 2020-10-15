import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Page } from '../shared';
import { getScheduleSelectors, fetchSchedule } from '../../store/schedule';

class SchedulePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchSchedule();
    }

    render() {
        return (
            <Page title="Schedule">
                <ul>
                    {this.props.baseSelectors.terms.selectAll().map(term => (
                        <li key={term.tid}>
                            {term.title}
                            <ul>
                                {this.props.getCoursesForTerm(term).map(course => (
                                    <li key={course.cid}>{course.title}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </Page>
        );
    }
}

SchedulePage.propTypes = {
    fetchSchedule: PropTypes.func,
    baseSelectors: PropTypes.object,
    getCoursesForTerm: PropTypes.func,
    getHolidaysForTerm: PropTypes.func,
    getSectionsForCourse: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        ...getScheduleSelectors(state.schedule),
    };
};

const mapDispatchToProps = { fetchSchedule };

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
