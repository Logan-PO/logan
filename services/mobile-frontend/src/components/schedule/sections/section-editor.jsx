import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import ListItem from '../../shared/list-item';
import { typographyStyles } from '../../shared/typography';
import DueDateControl from '../../shared/due-date-control';
import TimePicker from '../../shared/pickers/time-picker';
import NumberPicker from '../../shared/pickers/number-picker';
import DowPicker from '../../shared/pickers/dow-picker';
import ListHeader from '../../shared/list-header';
import Editor from 'packages/fe-shared/components/editor';
import { dateUtils } from 'packages/core';
import { getScheduleSelectors, updateSection, updateSectionLocal } from 'packages/fe-shared/store/schedule';

class SectionEditor extends Editor {
    constructor(props) {
        super(props, { id: 'sid', entity: 'section', mobile: true });

        let section;

        if (this.isEditor) {
            section = props.getSection(props.route.params.sid);
        } else {
            section = {
                cid: props.route.params.cid,
                title: '',
                startDate: dateUtils.formatAsDate(),
                endDate: dateUtils.formatAsDate(),
                startTime: dateUtils.formatAsTime(),
                endTime: dateUtils.formatAsTime(),
                weeklyRepeat: 1,
                daysOfWeek: [],
            };
        }

        this.state = { section };
    }

    selectEntity(id) {
        return this.props.getSection(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateSectionLocal({ id, changes });
    }

    updateEntity(section) {
        this.props.updateSection(section);
    }

    processChange(changes, prop, e) {
        changes[prop] = e;
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', marginBottom: 8 }}>
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
                                value={this.state.section.title}
                                onChangeText={this.handleChange.bind(this, 'title')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 0 }}
                />
                <ListHeader>Details</ListHeader>
                <ListItem
                    leftContent={
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={{ paddingHorizontal: 0, backgroundColor: 'none' }}
                                mode="flat"
                                label="Location"
                                value={this.state.section.location}
                                onChangeText={this.handleChange.bind(this, 'location')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 0 }}
                />
                <ListItem
                    leftContent={
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={{ paddingHorizontal: 0, backgroundColor: 'none' }}
                                mode="flat"
                                label="Instructor"
                                value={this.state.section.instructor}
                                onChangeText={this.handleChange.bind(this, 'instructor')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 0 }}
                />
                <ListHeader>Dates</ListHeader>
                <DueDateControl
                    datesOnly
                    label="Start Date"
                    value={this.state.section.startDate}
                    onChange={this.handleChange.bind(this, 'startDate')}
                />
                <DueDateControl
                    datesOnly
                    label="End Date"
                    value={this.state.section.endDate}
                    onChange={this.handleChange.bind(this, 'endDate')}
                />
                <NumberPicker
                    label="Weekly Interval"
                    value={this.state.section.weeklyRepeat}
                    onChange={this.handleChange.bind(this, 'weeklyRepeat')}
                />
                <DowPicker
                    value={this.state.section.daysOfWeek}
                    onChange={this.handleChange.bind(this, 'daysOfWeek')}
                />
                <ListHeader>Times</ListHeader>
                <TimePicker
                    label="Start Time"
                    value={this.state.section.startTime}
                    onChange={this.handleChange.bind(this, 'startTime')}
                />
                <TimePicker
                    label="End Time"
                    value={this.state.section.endTime}
                    onChange={this.handleChange.bind(this, 'endTime')}
                />
            </View>
        );
    }
}

SectionEditor.propTypes = {
    route: PropTypes.object,
    getTerm: PropTypes.func,
    getSection: PropTypes.func,
    updateSection: PropTypes.func,
    updateSectionLocal: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        getTerm: selectors.baseSelectors.terms.selectById,
        getSection: selectors.baseSelectors.sections.selectById,
    };
};

const mapDispatchToProps = {
    updateSection,
    updateSectionLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionEditor);
