import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import priorities from '../priority-constants';

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
