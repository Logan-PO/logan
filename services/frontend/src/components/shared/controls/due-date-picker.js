import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class DueDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.updateType = this.updateType.bind(this);
        this.updateDate = this.updateDate.bind(this);

        this.state = {
            dueDateType: undefined,
            lastDueDate: undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.value === prevProps.value) return;

        if (!this.props.value) {
            this.setState({
                dueDateType: undefined,
                lastDueDate: undefined,
            });
        } else if (this.props.value === 'asap' && this.state.dueDateType !== 'asap') {
            this.setState({ dueDateType: 'asap' });
        } else if (this.props.value === 'eventually' && this.state.dueDateType !== 'eventually') {
            this.setState({ dueDateType: 'eventually' });
        } else {
            this.setState({
                dueDateType: 'date',
                lastDueDate: this.props.value,
            });
        }
    }

    updateType(e) {
        const newType = e.target.value;

        this.setState({ dueDateType: newType });

        if (newType === 'date') {
            let lastDueDate = this.state.lastDueDate;
            if (!this.state.lastDueDate) {
                lastDueDate = dayjs().format(DB_DATE_FORMAT);
                this.setState({ lastDueDate });
            }

            this.props.onChange(lastDueDate);
        } else {
            this.props.onChange(newType);
        }
    }

    updateDate(e) {
        const str = e.format(DB_DATE_FORMAT);
        this.setState({ lastDueDate: str });
        this.props.onChange(str);
    }

    render() {
        return (
            <FormControl disabled={this.props.disabled}>
                <FormLabel color="secondary">Due date</FormLabel>
                <RadioGroup name="dueDateType" value={_.get(this.state, 'dueDateType', '')} onChange={this.updateType}>
                    <FormControlLabel
                        value="asap"
                        label="ASAP"
                        labelPlacement="end"
                        control={<Radio color="secondary" />}
                    />
                    <FormControlLabel
                        value="eventually"
                        label="Eventually"
                        labelPlacement="end"
                        control={<Radio color="secondary" />}
                    />
                    <FormControlLabel
                        value="date"
                        label={
                            <DatePicker
                                variant="inline"
                                disabled={_.get(this.state, 'dueDateType') !== 'date'}
                                value={dayjs(_.get(this.state, 'lastDueDate'))}
                                onChange={this.updateDate}
                                color="secondary"
                            />
                        }
                        labelPlacement="end"
                        control={<Radio color="secondary" />}
                    />
                </RadioGroup>
            </FormControl>
        );
    }
}

DueDatePicker.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default DueDatePicker;
