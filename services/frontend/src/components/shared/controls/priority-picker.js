import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, colors } from '@material-ui/core';

const priorities = {
    'Very high': [2, colors.deepOrange[500]],
    High: [1, colors.orange[500]],
    Normal: [0, colors.yellow[500]],
    Low: [-1, colors.green[500]],
    'Very low': [-2, colors.blue[500]],
};

class PriorityPicker extends React.Component {
    constructor(props) {
        super(props);
        this._internalChange = this._internalChange.bind(this);
    }

    _internalChange(e) {
        const fakeEvent = {
            target: {
                value: Number(e.target.value),
            },
        };

        this.props.onChange(fakeEvent);
    }

    render() {
        return (
            <FormControl disabled={this.props.disabled}>
                <FormLabel color="secondary">Priority</FormLabel>
                <RadioGroup name="priority" value={_.get(this.props, 'value', '')} onChange={this._internalChange}>
                    {Object.entries(priorities).map(([label, [value, color]]) => {
                        const style = {};
                        if (Number(this.props.value) === value) style.color = color;

                        return (
                            <FormControlLabel
                                key={label}
                                value={value}
                                label={label}
                                labelPlacement="end"
                                control={<Radio style={style} />}
                            />
                        );
                    })}
                </RadioGroup>
            </FormControl>
        );
    }
}

PriorityPicker.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.number,
    onChange: PropTypes.func,
};

export default PriorityPicker;
