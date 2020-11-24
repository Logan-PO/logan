import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import SyncComponent from '@logan/fe-shared/components/sync-component';
import { dateUtils } from '@logan/core';
import ListItem from '../shared/list-item';
import Typography from '../shared/typography';

class TermCell extends SyncComponent {
    constructor(props) {
        super(props);

        this.listItem = React.createRef();
    }

    async deletePressed() {
        if (this.props.onDeletePressed) {
            this.props.onDeletePressed(this.props.term, {
                confirm: this.listItem.current.collapse,
                deny: this.listItem.current.close,
            });
        }
    }

    render() {
        if (!this.props.term) return <ListItem />;

        return (
            <ListItem
                ref={this.listItem}
                leftContent={
                    <View>
                        <Typography variant="h6" style={{ marginBottom: 4 }}>
                            {this.props.term.title}
                        </Typography>
                        <Typography color="detail">
                            {`${dateUtils.humanReadableDate(this.props.term.startDate)} - ${dateUtils.humanReadableDate(
                                this.props.term.endDate
                            )}`}
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

TermCell.propTypes = {
    term: PropTypes.object,
    onPress: PropTypes.func,
    onDeletePressed: PropTypes.func,
};

export default TermCell;
