import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Colors, TouchableRipple } from 'react-native-paper';
import ListItem from '../list-item';
import Typography from '../typography';
import SyncComponent from 'packages/fe-shared/components/sync-component';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class DowPicker extends SyncComponent {
    constructor(props) {
        super(props);

        this.toggleDay = this.toggleDay.bind(this);

        this.state = {
            value: props.value || [],
        };
    }

    toggleDay(dow) {
        let updatedValue;

        if (this.state.value.includes(dow)) {
            updatedValue = _.reject(this.state.value, item => item === dow);
        } else {
            updatedValue = [...this.state.value, dow].sort();
        }

        this.setState({ value: updatedValue });

        this.props.onChange && this.props.onChange(updatedValue);
    }

    render() {
        return (
            <ListItem
                leftContent={
                    <View
                        style={{
                            borderColor: Colors.deepOrange500,
                            borderWidth: 1,
                            borderRadius: 3,
                            overflow: 'hidden',
                            width: '100%',
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'stretch',
                            justifyContent: 'space-between',
                        }}
                    >
                        {DAYS_OF_WEEK.map((dow, i) => {
                            const selected = this.state.value.includes(i);

                            return (
                                <TouchableRipple
                                    key={i}
                                    onPress={this.toggleDay.bind(this, i)}
                                    style={{
                                        flexGrow: 1,
                                        alignItems: 'stretch',
                                    }}
                                >
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            backgroundColor: selected ? Colors.deepOrange500 : 'white',
                                            padding: 6,
                                        }}
                                    >
                                        <Typography variant="button" color={selected ? 'white' : Colors.deepOrange500}>
                                            {dow}
                                        </Typography>
                                    </View>
                                </TouchableRipple>
                            );
                        })}
                    </View>
                }
                contentStyle={{ paddingVertical: 0 }}
            />
        );
    }
}

DowPicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
};

export default DowPicker;
