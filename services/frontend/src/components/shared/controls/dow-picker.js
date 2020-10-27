import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortValues = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class DowPicker extends React.Component {
    readableVersion(value) {
        return _.values(_.pick(shortValues, value)).join('/');
    }

    render() {
        return (
            <FormControl fullWidth={this.props.fullWidth} disabled={this.props.disabled}>
                <InputLabel>Days of Week</InputLabel>
                <Select
                    fullWidth={this.props.fullWidth}
                    multiple
                    value={this.props.value}
                    onChange={this.props.onChange}
                    renderValue={this.readableVersion}
                >
                    {daysOfWeek.map((day, index) => (
                        <MenuItem key={index} value={index}>
                            <CheckIcon
                                fontSize="small"
                                color="primary"
                                style={{ marginRight: '0.5em', opacity: this.props.value.includes(index) ? 1 : 0 }}
                            />
                            {day}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

DowPicker.propTypes = {
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
};

export default DowPicker;
