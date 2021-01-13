import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@material-ui/core';
import PriorityIcon from '@material-ui/icons/LabelImportant';
import priorities, { colorForValue } from '../displays/priority-constants';
import InputGroup from './input-group';
import './priority-picker.scss';

// eslint-disable-next-line react/prop-types
const CustomThumb = ({ style, ...rest }) => {
    const value = rest['aria-valuenow'];
    const color = colorForValue(value);

    return (
        <span style={{ ...style, color, '--hover-color': `${color}32`, '--active-color': `${color}50` }} {...rest} />
    );
};

class PriorityPicker extends React.Component {
    constructor(props) {
        super(props);
        this._internalChange = this._internalChange.bind(this);
    }

    _internalChange(e, value) {
        const fakeEvent = {
            target: { value },
        };

        this.props.onChange(fakeEvent);
    }

    render() {
        const marks = _.entries(priorities).map(([label, [value]]) => ({ value, label }));

        return (
            <InputGroup
                className="priority-group"
                label="Priority"
                icon={PriorityIcon}
                content={
                    <Slider
                        className="priority-slider"
                        style={{ width: '400px' }}
                        track={false}
                        name="priority"
                        classes={{
                            root: 'root',
                            track: 'track',
                            rail: 'track',
                            thumb: 'thumb',
                            mark: 'mark',
                            markLabel: 'mark-label',
                            markLabelActive: 'active',
                        }}
                        min={-2}
                        max={2}
                        step={1}
                        value={_.get(this.props, 'value', 0)}
                        onChange={this._internalChange}
                        marks={marks}
                        ThumbComponent={CustomThumb}
                    />
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
