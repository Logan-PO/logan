import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import priorities from '../priority-constants';
import ViewController from '../view-controller';

class PriorityPicker extends React.Component {
    constructor(props) {
        super(props);

        this.selectPriority = this.selectPriority.bind(this);

        this.state = {
            value: _.get(this.props.route, 'params.value'),
        };
    }

    selectPriority(value) {
        this.setState({ value });

        const onSelect = _.get(this.props.route, 'params.onSelect');

        if (onSelect) onSelect(value);

        this.props.navigation.goBack();
    }

    iconToDisplay(value, color) {
        const c = this.state.value === value ? color : 'rgba(0, 0, 0, 0)';
        return <Icon name="check" style={{ alignSelf: 'center' }} size={18} color={c} />;
    }

    render() {
        return (
            <ViewController navigation={this.props.navigation} route={this.props.route}>
                <ScrollView>
                    <View style={{ backgroundColor: 'white' }}>
                        {_.entries(priorities).map(([name, [value, color]]) => (
                            <List.Item
                                key={value}
                                left={() => this.iconToDisplay(value, color)}
                                title={name}
                                titleStyle={{ color }}
                                onPress={this.selectPriority.bind(this, value)}
                            />
                        ))}
                    </View>
                </ScrollView>
            </ViewController>
        );
    }
}

PriorityPicker.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
};

export default PriorityPicker;
