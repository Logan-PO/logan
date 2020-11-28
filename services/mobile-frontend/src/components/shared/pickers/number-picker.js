import React from 'react';
import PropTypes from 'prop-types';
import SyncComponent from '@logan/fe-shared/components/sync-component';
import { View, Button } from 'react-native';
import { Colors } from 'react-native-paper';
import ListItem from '../list-item';
import Typography from '../typography';

class NumberPicker extends SyncComponent {
    constructor(props) {
        super(props);

        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }

    increment() {
        this.props.onChange(this.props.value + 1);
    }

    decrement() {
        this.props.onChange(this.props.value - 1);
    }

    render() {
        return (
            <ListItem
                leftContent={<Typography>{this.props.label}</Typography>}
                rightContent={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Button
                            mode="text"
                            onPress={this.decrement}
                            title="-"
                            style={{ backgroundColor: 'none', textColor: Colors.lightBlue500 }}
                        />
                        <Typography
                            color="detail"
                            style={{
                                textAlign: 'center',
                                minWidth: 20,
                                marginHorizontal: 8,
                            }}
                        >
                            {this.props.value}
                        </Typography>
                        <Button mode="text" onPress={this.increment} title="+" />
                    </View>
                }
                contentStyle={{ paddingVertical: 0 }}
            />
        );
    }
}

NumberPicker.propTypes = {
    label: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
};

export default NumberPicker;
