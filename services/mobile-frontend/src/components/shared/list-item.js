import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, LayoutAnimation } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const styles = StyleSheet.create({
    animationContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
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
    actionSet: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    action: {
        height: '100%',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
    },
});

class ListItem extends React.Component {
    constructor(props) {
        super(props);

        this.updateSwipeableRef = this.updateSwipeableRef.bind(this);
        this.renderRightActions = this.renderRightActions.bind(this);
        this.collapse = this.collapse.bind(this);
        this.close = this.close.bind(this);

        this.state = {
            cellHeightValue: 'auto',
            offsetLeft: 0,
        };
    }

    updateSwipeableRef(ref) {
        this._swipeable = ref;
    }

    close() {
        this._swipeable.close();
    }

    async collapse() {
        const duration = 200;

        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.scaleY)
        );

        this.setState({ cellHeightValue: 0 });

        return new Promise(resolve => setTimeout(resolve, duration));
    }

    renderRightActions() {
        if (!this.props.actions) return;
        return (
            <View style={styles.actionSet}>
                {this.props.actions.map((props, i) => (
                    <Action key={i} {...props} />
                ))}
            </View>
        );
    }

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
            <View
                style={{
                    ...styles.animationContainer,
                    paddingLeft: this.state.offsetLeft,
                    height: this.state.cellHeightValue,
                }}
            >
                <Swipeable ref={this.updateSwipeableRef} renderRightActions={this.renderRightActions}>
                    <TouchableRipple onPress={this.props.onPress} style={styles.cell}>
                        <View style={styles.root}>
                            {this.props.beforeContent}
                            <View style={styles.container}>
                                <View style={styles.contentContainer}>
                                    {this.props.leftContent && (
                                        <View style={leftContentStyle}>{this.props.leftContent}</View>
                                    )}
                                    {this.props.rightContent && (
                                        <View style={rightContentStyle}>{this.props.rightContent}</View>
                                    )}
                                </View>
                                {this.props.showRightArrow && (
                                    <Icon name="chevron-right" size={24} style={styles.chevron} />
                                )}
                            </View>
                            {this.props.afterContent}
                        </View>
                    </TouchableRipple>
                </Swipeable>
            </View>
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
    actions: PropTypes.array,
};

class Action extends React.Component {
    constructor(props) {
        super(props);
        if (props.icon && props.text) throw new Error('Pass either icon or text to an Action, but not both');

        this.pressed = this.pressed.bind(this);
    }

    pressed() {
        this.props.action && this.props.action();
    }

    render() {
        const color = this.props.textColor || 'white';

        return (
            <TouchableRipple onPress={this.pressed}>
                <View style={{ ...styles.action, backgroundColor: this.props.backgroundColor }}>
                    {this.props.text && <Text style={{ color }}>{this.props.text}</Text>}
                    {this.props.icon && <Icon name={this.props.icon} size={24} color={color} />}
                </View>
            </TouchableRipple>
        );
    }
}

Action.propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    action: PropTypes.func,
};

export default ListItem;
