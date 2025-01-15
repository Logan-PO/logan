import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Typography from '../shared/typography';
import ListItem from '../shared/list-item';
import { dateUtils } from 'packages/core';

class ReminderCell extends React.Component {
    constructor(props) {
        super(props);

        this.listItem = React.createRef();
    }

    async deletePressed() {
        if (this.props.onDeletePressed) {
            this.props.onDeletePressed(this.props.reminder, {
                confirm: this.listItem.current.collapse,
                deny: this.listItem.current.close,
            });
        }
    }

    render() {
        if (!this.props.reminder) return <ListItem />;

        const ts = _.get(this.props.reminder, 'timestamp');
        const dateObject = dateUtils.toDateTime(ts);
        const timeString = `${dateUtils.humanReadableDate(dateObject)} at ${dateObject.format('h:mm A')}`;

        return (
            <ListItem
                ref={this.listItem}
                leftContent={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="notifications" color={Colors.grey500} size={20} style={{ marginRight: 16 }} />
                        <View style={{ flex: 1 }}>
                            <Typography>{this.props.reminder.message}</Typography>
                            <Typography color="detail">{timeString}</Typography>
                        </View>
                    </View>
                }
                onPress={this.props.onPress}
                actions={[{ icon: 'delete', backgroundColor: 'red', action: this.deletePressed.bind(this) }]}
            />
        );
    }
}

ReminderCell.propTypes = {
    reminder: PropTypes.object,
    onPress: PropTypes.func,
    onDeletePressed: PropTypes.func,
};

export default ReminderCell;
