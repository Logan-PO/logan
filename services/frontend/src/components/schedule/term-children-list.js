import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { getScheduleSelectors, createCourse, deleteCourse, createHoliday, deleteHoliday } from '../../store/schedule';
import '../shared/list.scss';

class TermChildrenList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectChild = this.didSelectChild.bind(this);
        this.didDeleteChild = this.didDeleteChild.bind(this);

        this.state = {
            selectedId: undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            this.setState({
                selectedId: undefined,
            });
        }
    }

    didSelectChild(type, id) {
        this.setState(() => ({ selectedId: id }));

        if (type === 'course') {
            this.props.onCourseSelected(id);
        } else if (type === 'holiday') {
            this.props.onHolidaySelected(id);
        }
    }

    didDeleteChild(type, child) {
        if (type === 'course') {
            this.props.deleteCourse(child);
        } else if (type === 'holiday') {
            this.props.deleteHoliday(child);
        }

        this.setState(() => ({ selectedId: undefined }));
        this.didSelectChild(type, undefined);
    }

    getCoursesList() {
        const courses = this.props.getCoursesForTerm({ tid: this.props.tid });

        if (courses.length) {
            return courses.map(course => {
                const isSelected = course.cid === this.state.selectedId;

                return (
                    <div key={course.cid} className="list-cell">
                        <ListItem
                            button
                            selected={isSelected}
                            onClick={() => this.didSelectChild('course', course.cid)}
                        >
                            <ListItemText primary={course.title} />
                            <ListItemSecondaryAction className="actions">
                                <IconButton edge="end" onClick={() => this.didDeleteChild('course', course)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </div>
                );
            });
        } else {
            return (
                <ListItem button disabled>
                    <ListItemText primary="No courses for this term yet" />
                </ListItem>
            );
        }
    }

    getHolidaysList() {
        const holidays = this.props.getHolidaysForTerm({ tid: this.props.tid });

        if (holidays.length) {
            return holidays.map(holiday => {
                const isSelected = holiday.hid === this.state.selectedId;

                return (
                    <div key={holiday.hid} className="list-cell">
                        <ListItem
                            button
                            selected={isSelected}
                            onClick={() => this.didSelectChild('holiday', holiday.hid)}
                        >
                            <ListItemText primary={holiday.title} />
                            <ListItemSecondaryAction className="actions">
                                <IconButton edge="end" onClick={() => this.didDeleteChild('holiday', holiday)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </div>
                );
            });
        } else {
            return (
                <ListItem button disabled>
                    <ListItemText primary="No holidays for this term yet" />
                </ListItem>
            );
        }
    }

    render() {
        return (
            <div className="scrollable-list">
                <div className="scroll-view">
                    <List>
                        <ListSubheader>Courses</ListSubheader>
                        {this.getCoursesList()}
                        <ListSubheader>Holidays</ListSubheader>
                        {this.getHolidaysList()}
                    </List>
                </div>
            </div>
        );
    }
}

TermChildrenList.propTypes = {
    tid: PropTypes.string,
    getTerm: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    getHolidaysForTerm: PropTypes.func,
    onCourseSelected: PropTypes.func,
    onHolidaySelected: PropTypes.func,
    createCourse: PropTypes.func,
    createHoliday: PropTypes.func,
    deleteCourse: PropTypes.func,
    deleteHoliday: PropTypes.func,
};

const mapStateToProps = state => {
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    return {
        getTerm: scheduleSelectors.baseSelectors.terms.selectById,
        ...scheduleSelectors,
    };
};

const mapDispatchToProps = { createCourse, deleteCourse, createHoliday, deleteHoliday };

export default connect(mapStateToProps, mapDispatchToProps)(TermChildrenList);
