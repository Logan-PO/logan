import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem, colors as muiColors } from '@material-ui/core';
import styles from './color-picker.module.scss';

function camelCaseToSentenceCase(str) {
    return _.upperFirst(_.camelCase(str).replace(/([A-Z])/g, ' $1'));
}

class ColorPicker extends React.Component {
    generateItems() {
        const colors = _.omit(muiColors, 'common');

        return [
            <MenuItem key="none" value="" className={styles.item}>
                None
            </MenuItem>,
            ..._.entries(colors).map(([key, value]) => {
                const name = camelCaseToSentenceCase(key);
                const color = value[500];

                return (
                    <MenuItem key={name} value={color} className={styles.item}>
                        <div className={styles.swatch} style={{ background: color }} />
                        {name}
                    </MenuItem>
                );
            }),
        ];
    }

    render() {
        return (
            <FormControl fullWidth={this.props.fullWidth} disabled={this.props.disabled}>
                <InputLabel>Color</InputLabel>
                <Select fullWidth={this.props.fullWidth} value={this.props.value} onChange={this.props.onChange}>
                    {this.generateItems()}
                </Select>
            </FormControl>
        );
    }
}

ColorPicker.propTypes = {
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default ColorPicker;
