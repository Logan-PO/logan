import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, colors as muiColors } from '@material-ui/core';
import styles from './color-picker.module.scss';

const allValidColors = _.omit(muiColors, 'common');
const primaryColors = _.pick(allValidColors, [
    'teal',
    'green',
    'lightGreen',
    'orange',
    'deepOrange',
    'red',
    'pink',
    'purple',
    'deepPurple',
    'indigo',
    'blue',
    'lightBlue',
    'blueGrey',
]);

function camelCaseToSentenceCase(str) {
    return _.upperFirst(_.camelCase(str).replace(/([A-Z])/g, ' $1'));
}

class ColorPicker extends React.Component {
    generateItems() {
        const colors = this.props.primaryOnly ? primaryColors : allValidColors;

        const items = [];

        if (!this.props.disableNone) {
            items.push(
                <MenuItem key="none" value="" className={styles.item}>
                    None
                </MenuItem>
            );
        }

        items.push(
            ..._.entries(colors).map(([key, value]) => {
                const name = camelCaseToSentenceCase(key);
                const color = value[500];

                return (
                    <MenuItem key={name} value={color} className={styles.item}>
                        <div className={styles.swatch} style={{ background: color }} />
                        {name}
                    </MenuItem>
                );
            })
        );

        return items;
    }

    render() {
        return (
            <FormControl variant={this.props.variant} fullWidth={this.props.fullWidth} disabled={this.props.disabled}>
                {this.props.label && <InputLabel>{this.props.label}</InputLabel>}
                <Select
                    fullWidth={this.props.fullWidth}
                    autoWidth
                    value={this.props.value}
                    onChange={this.props.onChange}
                >
                    {this.generateItems()}
                </Select>
            </FormControl>
        );
    }
}

ColorPicker.propTypes = {
    label: PropTypes.string,
    primaryOnly: PropTypes.bool,
    variant: PropTypes.string,
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disableNone: PropTypes.bool,
};

export default ColorPicker;
