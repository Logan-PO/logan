import React from 'react';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import TimeIcon from '@material-ui/icons/Schedule';
import TextInput from './text-input';
import InputGroup from './input-group';

const formats = ['hmma', 'h:mma', 'hmm a', 'h:mm a'];

function toValidDate(str) {
    if (!str.trim().endsWith('am') && !str.trim().endsWith('pm')) return;

    for (const format of formats) {
        const obj = dateUtils.dayjs(str, format);
        if (obj.isValid()) return obj;
    }
}

class TimePicker extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);

        this.state = {
            isValid: true,
            value: props.value.format('h:mma'),
        };
    }

    componentDidUpdate(prevProps) {
        const prevDate = prevProps.value ? prevProps.value.format('h:mma') : undefined;
        const currDate = this.props.value ? this.props.value.format('h:mma') : undefined;

        if (prevDate !== currDate) {
            this.setState({ isValid: true, value: currDate });
        }
    }

    onChange(e) {
        const str = e.target.value.toLowerCase();
        const dateValue = toValidDate(str);

        this.setState({ isValid: !!dateValue, value: str });

        if (dateValue && dateValue.format('h:mma') !== this.props.value.format('h:mma')) {
            this.props.onChange(dateValue);
        }
    }

    render() {
        const { label = 'Time', inputGroupProps } = this.props;
        const { isValid, value } = this.state;

        const helperText = isValid ? undefined : 'Invalid value';

        return (
            <InputGroup
                label={label}
                icon={TimeIcon}
                error={!isValid}
                content={<TextInput error={!isValid} value={value} onChange={this.onChange} />}
                helperText={helperText}
                {...inputGroupProps}
            />
        );
    }
}

TimePicker.propTypes = {
    label: PropTypes.string,
    inputGroupProps: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
};

export default TimePicker;
