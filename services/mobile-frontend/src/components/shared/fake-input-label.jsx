import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Colors } from 'react-native-paper';

export default function FakeInputLabel({ children }) {
    return (
        <View style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 11, color: Colors.grey700 }}>{children}</Text>
        </View>
    );
}

FakeInputLabel.propTypes = {
    children: PropTypes.node,
};
