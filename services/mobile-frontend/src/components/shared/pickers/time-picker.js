import React from 'react';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import SyncComponent from '@logan/fe-shared/components/sync-component';
import { View, LayoutAnimation, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ListItem from '../list-item';
import Typography from '../typography';

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
        this.props.onChange && this.props.onChange(time);

        if (Platform.OS === 'android') {
            //It opens again during the closing animation and chooses the later time value
            //This makes it only open twice versus never closing
            return this.close();
        }

        if (event.type === 'neutralButtonPressed') return this.close();
    }

    render() {
        return (
            <React.Fragment>
                <ListItem
                    leftContent={<Typography>{this.props.label || 'Time'}</Typography>}
                    rightContent={
                        <Typography color="detail">{dateUtils.toTime(this.props.value).format('h:mm a')}</Typography>
                    }
                    onPress={this.open}
                />
                <View
                    style={{
                        overflow: 'hidden',
                        height: this.state.open ? 'auto' : 0,
                        backgroundColor: 'white',
                    }}
                >
                    {this.state.open && ( //TODO: We need to check on closed instead of on changed for android
                        <DateTimePicker
                            value={dateUtils.toTime(this.props.value).toDate()}
                            mode="time"
                            onChange={d => {
                                if (d && Platform.OS !== 'iOS') {
                                    const time = dateUtils.formatAsTime(dateUtils.dayjs(d));

                                    this.setState({ date: time });
                                }
                            }}
                            onClosed={date => {
                                const time = dateUtils.formatAsTime(dateUtils.dayjs(date));
                                if (date && Platform.OS !== 'iOS') {
                                    //this.props.onChange && this.props.onChange(time);
                                    this.setState({ open: false, date: time });
                                } else {
                                    //this.props.onChange && this.props.onChange(time);
                                    this.setState({ open: false });
                                }
                            }}
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
};

export default TimePicker;
