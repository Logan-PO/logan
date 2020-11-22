import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    cell: {
        backgroundColor: 'white',
    },
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
        alignItems: 'center',
    },
    chevron: {
        marginRight: 8,
        color: 'gray',
        flex: 0,
    },
    contentContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
    },
});

class ListItem extends React.Component {
    render() {
        const leftContentStyle = _.merge({ flex: 1 }, styles.content, this.props.contentStyle);

        const rightContentStyle = _.merge(
            {
                paddingLeft: this.props.leftContent ? 0 : 16,
                paddingRight: this.props.showRightArrow ? 4 : 16,
            },
            styles.content,
            this.props.contentStyle
        );

        return (
            <TouchableRipple onPress={this.props.onPress} style={styles.cell}>
                <View style={styles.root}>
                    {this.props.beforeContent}
                    <View style={styles.container}>
                        <View style={styles.contentContainer}>
                            {this.props.leftContent && <View style={leftContentStyle}>{this.props.leftContent}</View>}
                            {this.props.rightContent && (
                                <View style={rightContentStyle}>{this.props.rightContent}</View>
                            )}
                        </View>
                        {this.props.showRightArrow && <Icon name="chevron-right" size={24} style={styles.chevron} />}
                    </View>
                    {this.props.afterContent}
                </View>
            </TouchableRipple>
        );
    }
}

ListItem.propTypes = {
    onPress: PropTypes.func,
    rootStyle: PropTypes.object,
    contentStyle: PropTypes.object,
    leftContent: PropTypes.object,
    rightContent: PropTypes.object,
    showRightArrow: PropTypes.bool,
    beforeContent: PropTypes.object,
    afterContent: PropTypes.object,
};

export default ListItem;
