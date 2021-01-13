import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import PriorityIcon from '@material-ui/icons/LabelImportant';
import priorities from '../displays/priority-constants';
import InputGroup from './input-group';

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
            <InputGroup
                label="Priority"
                icon={PriorityIcon}
                content={
                    <RadioGroup
                        row
                        name="priority"
                        value={_.get(this.props, 'value', '')}
                        onChange={this._internalChange}
                    >
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
                }
            />
        );
    }
}

PriorityPicker.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.number,
    onChange: PropTypes.func,
};

export default PriorityPicker;
