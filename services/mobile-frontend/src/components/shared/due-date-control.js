import React from 'react';
import PropTypes from 'prop-types';
import { View, LayoutAnimation } from 'react-native';
import DueDatePicker from './pickers/due-date-picker';
import ListItem from './list-item';
import Typography from './typography';
import { dateUtils } from 'packages/core';

class DueDateControl extends React.Component {
    constructor(props) {
        super(props);
        this.toggleDueDatePicker = this.toggleDueDatePicker.bind(this);

        this.state = {
            dueDatePickerOpen: false,
            dueDatePickerHeight: 0,
        };
    }

    async setStateSync(update) {
        return new Promise(resolve => this.setState(update, resolve));
    }

    toggleDueDatePicker() {
        const duration = 300;

        if (this.state.dueDatePickerOpen) {
            return this.closeDatePicker(duration);
        } else {
            return this.openDatePicker(duration);
        }
    }

    async openDatePicker(duration) {
        await this.setStateSync({
            dueDatePickerOpen: true,
            dueDatePickerHeight: 0,
        });

        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );

        this.setState({ dueDatePickerHeight: 'auto' });

        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async closeDatePicker(duration) {
        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );

        this.setState({
            dueDatePickerOpen: false,
            dueDatePickerHeight: 0,
        });

        return new Promise(resolve => setTimeout(resolve, duration));
    }

    render() {
        return (
            <React.Fragment>
                <ListItem
                    leftContent={<Typography>{this.props.label || 'Due Date'}</Typography>}
                    rightContent={<Typography color="detail">{dateUtils.readableDueDate(this.props.value)}</Typography>}
                    onPress={this.toggleDueDatePicker}
                />
                <View style={{ overflow: 'hidden', height: this.state.dueDatePickerHeight, backgroundColor: 'white' }}>
                    {this.state.dueDatePickerOpen && (
                        <View
                            style={{
                                height: this.state.dueDatePickerHeight,
                                paddingBottom: 12,
                            }}
                        >
                            <DueDatePicker
                                value={this.props.value}
                                onChange={this.props.onChange}
                                datesOnly={this.props.datesOnly}
                            />
                        </View>
                    )}
                </View>
            </React.Fragment>
        );
    }
}

DueDateControl.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    datesOnly: PropTypes.bool,
    onChange: PropTypes.func,
};

export default DueDateControl;
