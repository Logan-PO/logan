import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ListItem from '../../shared/list-item';
import Typography from '../../shared/typography';
import ColorSwatch from '../../shared/displays/color-swatch';

class CourseCell extends React.Component {
    constructor(props) {
        super(props);

        this.listItem = React.createRef();
    }

    async deletePressed() {
        if (this.props.onDeletePressed) {
            this.props.onDeletePressed(this.props.course, {
                confirm: this.listItem.current.collapse,
                deny: this.listItem.current.close,
            });
        }
    }

    render() {
        if (!this.props.course) return <ListItem />;

        return (
            <ListItem
                ref={this.listItem}
                leftContent={
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0, marginRight: 16 }}>
                            <ColorSwatch color={this.props.course.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Typography style={{ marginBottom: 4 }}>{this.props.course.title}</Typography>
                        </View>
                    </View>
                }
                onPress={this.props.onPress}
                actions={[{ icon: 'delete', backgroundColor: 'red', action: this.deletePressed.bind(this) }]}
                showRightArrow
            />
        );
    }
}

CourseCell.propTypes = {
    course: PropTypes.object,
    onPress: PropTypes.func,
    onDeletePressed: PropTypes.func,
};

export default CourseCell;
