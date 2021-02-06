import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { InputBase, Select, ListSubheader, MenuItem } from '@material-ui/core';
import CourseIcon from '@material-ui/icons/Book';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import InputGroup from './input-group';
import styles from './course-picker.module.scss';

class CoursePicker extends React.Component {
    getDerivedValue() {
        if (this.props.value !== 'none' && !this.props.allCids.includes(this.props.value)) return undefined;
        else return this.props.value;
    }

    generateItems() {
        const terms = this.props.tids.map(tid => {
            const term = { ...this.props.getTerm(tid) };
            term.courses = this.props.getCoursesForTerm(term);
            return term;
        });

        const items = [];
        items.push(
            <MenuItem key="none" value="none">
                None
            </MenuItem>
        );

        for (const term of terms.filter(term => term.courses.length)) {
            console.log(term);
            items.push(
                <ListSubheader key={term.tid} className={styles.menuTitle} style={{ textDecorationLine: 'underline' }}>
                    {term.title}
                </ListSubheader>
            );
            for (const course of term.courses) {
                const itemStyle = {
                    ...(!this.props.disabled && { color: course.color }), // Only set color if enabled
                };

                items.push(
                    <MenuItem key={course.cid} value={course.cid}>
                        <span className={styles.menuItem} style={itemStyle}>
                            {course.nickname || course.title}
                        </span>
                    </MenuItem>
                );
            }
        }

        return items;
    }

    render() {
        const course = this.props.getCourse(this.props.value) || {};
        const courseColor = course.color;

        return (
            <InputGroup
                label="Course"
                icon={CourseIcon}
                color={courseColor}
                content={
                    <Select
                        disabled={this.props.disabled}
                        style={{ color: courseColor }}
                        IconComponent={KeyboardArrowDownIcon}
                        classes={{
                            select: styles.selectControl,
                            icon: styles.selectIcon,
                        }}
                        value={this.getDerivedValue()}
                        onChange={this.props.onChange}
                        input={<InputBase />}
                    >
                        {this.generateItems()}
                    </Select>
                }
            />
        );
    }
}

CoursePicker.propTypes = {
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    tids: PropTypes.array,
    getTerm: PropTypes.func,
    getCourse: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    allCids: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

CoursePicker.defaultProps = {
    tids: [],
    value: 'none',
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        tids: selectors.baseSelectors.terms.selectIds(),
        getTerm: selectors.baseSelectors.terms.selectById,
        getCoursesForTerm: selectors.getCoursesForTerm,
        getCourse: selectors.baseSelectors.courses.selectById,
        allCids: selectors.baseSelectors.courses.selectIds(),
    };
};

export default connect(mapStateToProps, null)(CoursePicker);
