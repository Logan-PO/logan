import React from 'react';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { View, LayoutAnimation } from 'react-native';
import { Calendar } from 'react-native-calendars';
import SegmentedControl from '@react-native-community/segmented-control';
import { getCurrentTheme } from '../../../globals/theme';

class DueDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);

        if (props.datesOnly && !dateUtils.dueDateIsDate(props.value)) {
            console.warn(`Non-date dueDate supplied to a datePicker with datesOnly=true`);
        }

        this.state = {
            currentType: dateUtils.dueDateType(props.value) || 'date',
            currentDate: dateUtils.dueDateIsDate(props.value)
                ? this.toPickerFormat(props.value)
                : this.toPickerFormat(),
        };
    }

    toPickerFormat(date) {
        return dateUtils.dayjs(date).format('YYYY-MM-DD');
    }

    handleTypeChange(event) {
        let nextType = ['date', 'asap', 'eventually'][event.nativeEvent.selectedSegmentIndex];

        LayoutAnimation.configureNext(
            LayoutAnimation.create(150, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );

        this.setState({ currentType: nextType });

        if (nextType === 'date') {
            this.props.onChange(this.state.currentDate);
        } else {
            this.props.onChange(nextType);
        }

        return new Promise(resolve => setTimeout(resolve, 150));
    }

    handleDateChange(day) {
        const formatted = dateUtils.formatAsDate(dateUtils.dayjs(day.dateString));

        this.setState({
            currentType: 'date',
            currentDate: this.toPickerFormat(formatted),
        });

        this.props.onChange(formatted);
    }

    _segmentedControlValue() {
        if (dateUtils.dueDateIsDate(this.props.value)) {
            return 0;
        } else if (this.props.value === 'eventually') {
            return 2;
        } else {
            return 1;
        }
    }

    render() {
        const theme = getCurrentTheme();

        return (
            <View style={{ backgroundColor: 'white' }}>
                {!this.props.datesOnly && (
                    <View style={{ paddingHorizontal: 16 }}>
                        <SegmentedControl
                            selectedIndex={this._segmentedControlValue()}
                            values={['On date', 'ASAP', 'Eventually']}
                            onChange={this.handleTypeChange}
                        />
                    </View>
                )}
                {this.state.currentType === 'date' && (
                    <View style={{ marginTop: this.props.datesOnly ? 0 : 6 }}>
                        <Calendar
                            current={this.state.currentDate}
                            onDayPress={this.handleDateChange}
                            markedDates={{
                                [this.state.currentDate]: {
                                    selected: true,
                                    disableTouchEvent: true,
                                },
                            }}
                            theme={{
                                arrowColor: theme.colors.primary,
                                todayTextColor: theme.colors.accent,
                                selectedDayBackgroundColor: theme.colors.primary,
                                selectedDayTextColor: 'white',
                                textDayFontWeight: 'normal',
                                textMonthFontWeight: 'normal',
                                textDayHeaderFontWeight: 'normal',
                            }}
                        />
                    </View>
                )}
            </View>
        );
    }
}

DueDatePicker.propTypes = {
    value: PropTypes.string,
    datesOnly: PropTypes.bool,
    onChange: PropTypes.func,
};

DueDatePicker.defaultProps = {
    onChange: () => {},
};

export default DueDatePicker;
