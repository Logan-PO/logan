import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getScheduleSelectors, updateTerm, updateTermLocal, deleteCourse } from '@logan/fe-shared/store/schedule';
import { dateUtils } from '@logan/core';
import Editor from '@logan/fe-shared/components/editor';
import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper';
import ListItem from '../../shared/list-item';
import Typography, { typographyStyles } from '../../shared/typography';
import DueDateControl from '../../shared/due-date-control';
import CourseCell from '../courses/course-cell';
import HolidayCell from '../holidays/holiday-cell';
import ListHeader from '../../shared/list-header';

class TermEditor extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'term', mobile: true });

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        let term;

        if (this.isEditor) {
            term = props.getTerm(props.route.params.tid);
        } else {
            term = {
                title: '',
                startDate: dateUtils.formatAsDate(),
                endDate: dateUtils.formatAsDate(),
            };
        }

        this.state = { term };
    }

    openModal({ message, confirm }) {
        this.setState({
            modalShown: true,
            modalMessage: message,
            modalConfirmation: () => {
                confirm && confirm();
                this.closeModal();
            },
        });
    }

    closeModal() {
        this.setState({
            modalShown: false,
            modalMessage: undefined,
            modalConfirmation: undefined,
        });
    }

    selectEntity(id) {
        return this.props.getTerm(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateTermLocal({ id, changes });
    }

    updateEntity(term) {
        this.props.updateTerm(term);
    }

    processChange(changes, prop, e) {
        changes[prop] = e;
    }

    coursesList() {
        const courses = this.props.getCoursesForTerm(this.state.term);

        return (
            <React.Fragment>
                <ListHeader style={{ marginTop: 8 }}>Courses</ListHeader>
                {!courses.length && (
                    <ListItem
                        key="none"
                        leftContent={
                            <Typography color="secondary" style={{ fontStyle: 'italic' }}>
                                None
                            </Typography>
                        }
                    />
                )}
                {courses.map(course => (
                    <CourseCell
                        key={course.cid}
                        course={course}
                        onPress={() => this.props.navigation.push('Course', { tid: course.cid, cid: course.cid })}
                        onDeletePressed={() =>
                            this.openModal({
                                message: 'You are about to delete a course.\nThis cannot be undone.',
                                confirm: () => this.props.deleteCourse(course),
                            })
                        }
                    />
                ))}
            </React.Fragment>
        );
    }

    holidaysList() {
        const holidays = this.props.getHolidaysForTerm(this.state.term);

        return (
            <React.Fragment>
                <ListHeader style={{ marginTop: 8 }}>Holidays</ListHeader>
                {!holidays.length && (
                    <ListItem
                        key="none"
                        leftContent={
                            <Typography color="secondary" style={{ fontStyle: 'italic' }}>
                                None
                            </Typography>
                        }
                    />
                )}
                {holidays.map(holiday => (
                    <HolidayCell
                        key={holiday.hid}
                        holiday={holiday}
                        onPress={() => this.props.navigation.push('Holiday', { tid: holiday.hid, hid: holiday.hid })}
                        onDeletePressed={() =>
                            this.openModal({
                                message: 'You are about to delete a holiday.\nThis cannot be undone.',
                                confirm: () => this.props.deleteHoliday(holiday),
                            })
                        }
                    />
                ))}
            </React.Fragment>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ListItem
                    leftContent={
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    paddingHorizontal: 0,
                                    flexGrow: 1,
                                    backgroundColor: 'none',
                                    ...typographyStyles.h5,
                                }}
                                mode="flat"
                                label="Title"
                                value={this.state.term.title}
                                onChangeText={this.handleChange.bind(this, 'title')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 0 }}
                />
                <DueDateControl
                    datesOnly
                    label="Start Date"
                    value={this.state.term.startDate}
                    onChange={this.handleChange.bind(this, 'startDate')}
                />
                <DueDateControl
                    datesOnly
                    label="End Date"
                    value={this.state.term.endDate}
                    onChange={this.handleChange.bind(this, 'endDate')}
                />
                {this.isEditor && (
                    <View style={{ flex: 1, marginBottom: 16 }}>
                        {this.coursesList()}
                        {this.holidaysList()}
                    </View>
                )}
                <Portal>
                    <Dialog visible={this.state.modalShown} onDismiss={this.closeModal}>
                        <Dialog.Title>Are you sure?</Dialog.Title>
                        <Dialog.Content>
                            {_.get(this.state, 'modalMessage', '')
                                .split('\n')
                                .map((line, i) => (
                                    <Paragraph key={i}>{line}</Paragraph>
                                ))}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.closeModal} labelStyle={typographyStyles.button}>
                                Cancel
                            </Button>
                            <Button
                                onPress={this.state.modalConfirmation}
                                color="red"
                                labelStyle={typographyStyles.button}
                            >
                                Delete
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }
}

TermEditor.propTypes = {
    route: PropTypes.object,
    getTerm: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    getHolidaysForTerm: PropTypes.func,
    updateTerm: PropTypes.func,
    updateTermLocal: PropTypes.func,
    deleteCourse: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        getTerm: selectors.baseSelectors.terms.selectById,
        getCoursesForTerm: selectors.getCoursesForTerm,
        getHolidaysForTerm: selectors.getHolidaysForTerm,
    };
};

const mapDispatchToProps = {
    updateTerm,
    updateTermLocal,
    deleteCourse,
};

export default connect(mapStateToProps, mapDispatchToProps)(TermEditor);
