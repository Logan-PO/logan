import React from 'react';
import PropTypes from 'prop-types';
import { View, LayoutAnimation, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ListItem from '../list-item';
import Typography from '../typography';
import SyncComponent from 'packages/fe-shared/components/sync-component';
import { dateUtils } from 'packages/core';

class TimePicker extends SyncComponent {
    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.valueChanged = this.valueChanged.bind(this);

        this.state = {
            open: false,
        };
    }

    async open() {
        const duration = 200;
        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );
        await this.setStateSync({ open: true });
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async close() {
        const duration = 200;
        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );
        await this.setStateSync({ open: false });
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    valueChanged(event, dateString) {
        const time = dateUtils.formatAsTime(dateUtils.dayjs(dateString));
        if (Platform.OS === 'android') {
            //This is what must be done to avoid double time picker DO NOT CHANGE until a better solution is found
            this.close();
            this.setState({ open: false });
            this.props.onChange && this.props.onChange(time);
        } else this.props.onChange && this.props.onChange(time);
    }

    render() {
        return (
            <React.Fragment>
                <ListItem
                    leftContent={<Typography>{this.props.label || 'Time'}</Typography>}
                    rightContent={
                        <Typography color="detail">{dateUtils.toTime(this.props.value).format('h:mm a')}</Typography>
                    }
                    onPress={this.state.open ? this.close : this.open}
                />
                <View
                    style={{
                        overflow: 'hidden',
                        height: this.state.open ? 'auto' : 0,
                        backgroundColor: 'white',
                    }}
                >
                    {this.state.open && (
                        <DateTimePicker
                            value={dateUtils.toTime(this.props.value).toDate()}
                            mode="time"
                            minuteInterval={this.props.minuteInterval}
                            onChange={this.valueChanged}
                        />
                    )}
                </View>
            </React.Fragment>
        );
    }
}

TimePicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    minuteInterval: PropTypes.number,
};

export default TimePicker;
