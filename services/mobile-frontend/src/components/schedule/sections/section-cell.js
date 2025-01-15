import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { dateUtils } from 'packages/core';
import ListItem from '../../shared/list-item';
import Typography from '../../shared/typography';

class SectionCell extends React.Component {
    constructor(props) {
        super(props);

        this.listItem = React.createRef();
    }

    async deletePressed() {
        if (this.props.onDeletePressed) {
            this.props.onDeletePressed(this.props.section, {
                confirm: this.listItem.current.collapse,
                deny: this.listItem.current.close,
            });
        }
    }

    render() {
        if (!this.props.section) return <ListItem />;

        return (
            <ListItem
                ref={this.listItem}
                leftContent={
                    <View style={{ flex: 1 }}>
                        <Typography style={{ marginBottom: 4 }}>{this.props.section.title}</Typography>
                        <Typography color="detail" style={{ marginBottom: 4 }}>
                            {`${dateUtils.humanReadableDate(
                                this.props.section.startDate
                            )} - ${dateUtils.humanReadableDate(this.props.section.endDate)}`}
                        </Typography>
                        <Typography color="detail" style={{ marginBottom: 4 }}>
                            {this.props.section.daysOfWeek
                                .map(dow => dateUtils.dayjs().weekday(dow).format('ddd'))
                                .join('/')}
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

SectionCell.propTypes = {
    section: PropTypes.object,
    onPress: PropTypes.func,
    onDeletePressed: PropTypes.func,
};

export default SectionCell;
