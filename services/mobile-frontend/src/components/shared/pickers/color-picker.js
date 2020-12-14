import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import SyncComponent from '@logan/fe-shared/components/sync-component';
import { View, LayoutAnimation } from 'react-native';
import { Colors, TouchableRipple } from 'react-native-paper';
import ListItem from '../list-item';
import Typography from '../typography';

function camelCaseToSentenceCase(str) {
    return _.upperFirst(_.camelCase(str).replace(/([A-Z])/g, ' $1'));
}

const namedColors = {};

const names = _.uniq(_.keys(Colors).map(color => color.replace(/A*\d+/, '')));
for (const name of names) {
    namedColors[name] = {
        name: camelCaseToSentenceCase(name),
        color: Colors[`${name}500`] || Colors[name],
    };
}

delete namedColors.white;

const themeableColors = { ...namedColors };
delete themeableColors.black;

export { namedColors as colors };

export function nameForColor(hex) {
    const result = _.find(_.entries(namedColors), entry => hex === entry[1].color);
    return result[0];
}

class ColorPicker extends SyncComponent {
    constructor(props) {
        super(props);

        this.onViewLayout = this.onViewLayout.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            open: false,
            color: props.value,
            swatchSize: 0,
        };
    }

    onViewLayout({ nativeEvent }) {
        this.setState({
            swatchSize: nativeEvent.layout.width / 5,
        });
    }

    async handleChange(color) {
        this.props.onChange && (await this.props.onChange(color));
        const duration = 100;
        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );
        await this.setStateSync({ color });
        await new Promise(resolve => setTimeout(resolve, duration));
        return this.close();
    }

    async open() {
        const duration = 200;
        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );
        await this.setStateSync({ open: true });
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async close() {
        const duration = 200;
        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );
        await this.setStateSync({ open: false });
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    render() {
        const colorsToUse = this.props.themeablesOnly ? themeableColors : namedColors;

        const namedColor = _.find(_.values(namedColors), ({ color }) => this.props.value === color);

        return (
            <React.Fragment>
                <ListItem
                    leftContent={<Typography>{this.props.label || 'Color'}</Typography>}
                    rightContent={
                        <Typography style={{ fontWeight: 'bold' }} color={this.props.value}>
                            {namedColor.name}
                        </Typography>
                    }
                    onPress={this.state.open ? this.close : this.open}
                />
                <View
                    style={{
                        overflow: 'hidden',
                        height: this.state.open ? 'auto' : 0,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingBottom: this.state.open ? 8 : 0,
                    }}
                    onLayout={this.onViewLayout}
                >
                    {_.orderBy(_.values(colorsToUse), ['color'], ['desc']).map(({ color }, i) => {
                        const selected = color === this.state.color;

                        const padding = 6;

                        const margin = selected ? padding : 0;
                        const size = this.state.swatchSize - (selected ? padding * 2 : 0);

                        return (
                            <TouchableRipple key={i} onPress={this.handleChange.bind(this, color)}>
                                <View
                                    style={{
                                        margin: margin,
                                        width: size,
                                        height: size,
                                        backgroundColor: color,
                                    }}
                                />
                            </TouchableRipple>
                        );
                    })}
                </View>
            </React.Fragment>
        );
    }
}

ColorPicker.propTypes = {
    themeablesOnly: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default ColorPicker;
