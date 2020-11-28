import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getScheduleSelectors, updateHoliday, updateHolidayLocal } from '@logan/fe-shared/store/schedule';
import { dateUtils } from '@logan/core';
import Editor from '@logan/fe-shared/components/editor';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import ListItem from '../../shared/list-item';
import { typographyStyles } from '../../shared/typography';
import DueDateControl from '../../shared/due-date-control';

class HolidayEditor extends Editor {
    constructor(props) {
        super(props, { id: 'hid', entity: 'holiday', mobile: true });

        let holiday;

        if (this.isEditor) {
            holiday = props.getHoliday(props.route.params.hid);
        } else {
            holiday = {
                tid: props.route.params.tid,
                title: '',
                startDate: dateUtils.formatAsDate(),
                endDate: dateUtils.formatAsDate(),
            };
        }

        this.state = { holiday };
    }

    selectEntity(id) {
        return this.props.getHoliday(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateTermLocal({ id, changes });
    }

    updateEntity(holiday) {
        this.props.updateHoliday(holiday);
    }

    processChange(changes, prop, e) {
        changes[prop] = e;
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
                                value={this.state.holiday.title}
                                onChangeText={this.handleChange.bind(this, 'title')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 0 }}
                />
                <DueDateControl
                    datesOnly
                    label="Start Date"
                    value={this.state.holiday.startDate}
                    onChange={this.handleChange.bind(this, 'startDate')}
                />
                <DueDateControl
                    datesOnly
                    label="End Date"
                    value={this.state.holiday.endDate}
                    onChange={this.handleChange.bind(this, 'endDate')}
                />
            </View>
        );
    }
}

HolidayEditor.propTypes = {
    route: PropTypes.object,
    getHoliday: PropTypes.func,
    updateHoliday: PropTypes.func,
    updateHolidayLocal: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        getHoliday: selectors.baseSelectors.holidays.selectById,
    };
};

const mapDispatchToProps = {
    updateHoliday,
    updateHolidayLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(HolidayEditor);
