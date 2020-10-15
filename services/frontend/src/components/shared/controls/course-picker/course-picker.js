import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, MenuItem, ListSubheader } from '@material-ui/core';
import { getScheduleSelectors } from '../../../../store/schedule';
import CoursePickerItem from './course-picker-item';

class CoursePicker extends React.Component {
    render() {
        const terms = this.props.getAllTerms().map(term => ({
            ...term,
            courses: this.props.getCoursesForTerm(term),
        }));

        return (
            <Select>
                <MenuItem>None</MenuItem>
                {terms.map(term => (
                    <React.Fragment key={term.tid}>
                        <ListSubheader>{term.title}</ListSubheader>
                        {term.courses.map(course => (
                            <CoursePickerItem key={course.cid} cid={course.cid} />
                        ))}
                    </React.Fragment>
                ))}
            </Select>
        );
    }
}

CoursePicker.propTypes = {
    getAllTerms: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);
    const allTerms = selectors.baseSelectors.terms.selectAll();

    return {
        ...selectors,
        getAllTerms: selectors.baseSelectors.terms.selectAll,
    };
};

export default connect(mapStateToProps, null)(CoursePicker);
