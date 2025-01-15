import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ListItem from '../../shared/list-item';
import Typography from '../../shared/typography';
import SyncComponent from 'packages/fe-shared/components/sync-component';
import { dateUtils } from 'packages/core';

class HolidayCell extends SyncComponent {
    constructor(props) {
        super(props);

        this.listItem = React.createRef();
    }

    async deletePressed() {
        if (this.props.onDeletePressed) {
            this.props.onDeletePressed(this.props.holiday, {
                confirm: this.listItem.current.collapse,
                deny: this.listItem.current.close,
            });
        }
    }

    render() {
        if (!this.props.holiday) return <ListItem />;

        return (
            <ListItem
                ref={this.listItem}
                leftContent={
                    <View>
                        <Typography>{this.props.holiday.title}</Typography>
                        <Typography color="detail">
                            {`${dateUtils.humanReadableDate(
                                this.props.holiday.startDate
                            )} - ${dateUtils.humanReadableDate(this.props.holiday.endDate)}`}
                        </Typography>
                    </View>
                }
                onPress={this.props.onPress}
                actions={[{ icon: 'delete', backgroundColor: 'red', action: this.deletePressed.bind(this) }]}
                showRightArrow
            />
        );
    }
}

HolidayCell.propTypes = {
    holiday: PropTypes.object,
    onPress: PropTypes.func,
    onDeletePressed: PropTypes.func,
};

export default HolidayCell;
