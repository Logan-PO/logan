import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { typographyStyles, colorStyles } from './typography';

const styles = StyleSheet.create({
    cell: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
    },
});

class ListItem extends React.Component {
    render() {
        return (
            <TouchableRipple
                onPress={this.props.onPress}
                style={{ backgroundColor: this.props.backgroundColor || 'white' }}
            >
                <View style={styles.cell}>
                    <Text style={{ ...typographyStyles.body }}>Example list item</Text>
                </View>
            </TouchableRipple>
        );
    }
}

ListItem.propTypes = {
    backgroundColor: PropTypes.string,
    onPress: PropTypes.func,
};

export default ListItem;
