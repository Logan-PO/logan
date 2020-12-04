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

    componentDidMount() {
        this.updateState(true);
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        const isNewEntity = prevProps.entityId !== this.props.entityId;

        this.updateState(isNewEntity);
    }

    updateState(isNewEntity) {
        if (!this.props.value) {
            this.setState({
                dueDateType: undefined,
                lastDueDate: undefined,
            });
        } else if (this.props.value === 'asap') {
            this.setState({
                dueDateType: 'asap',
                ...(isNewEntity && { lastDueDate: undefined }),
            });
        } else if (this.props.value === 'eventually') {
            this.setState({
                dueDateType: 'eventually',
                ...(isNewEntity && { lastDueDate: undefined }),
            });
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
        const lastDueDate = _.get(this.state, 'lastDueDate');
        const dateValue = lastDueDate ? dayjs(lastDueDate) : null;

        return (
            <FormControl disabled={this.props.disabled}>
                <FormLabel style={{ fontSize: '0.75rem' }}>Due Date</FormLabel>
                <RadioGroup name="dueDateType" value={_.get(this.state, 'dueDateType', '')} onChange={this.updateType}>
                    <FormControlLabel value="asap" label="ASAP" labelPlacement="end" control={<Radio />} />
                    <FormControlLabel value="eventually" label="Eventually" labelPlacement="end" control={<Radio />} />
                    <FormControlLabel
                        value="date"
                        label={
                            <DatePicker
                                variant="inline"
                                disabled={_.get(this.state, 'dueDateType') !== 'date'}
                                value={dateValue}
                                onChange={this.updateDate}
                                labelFunc={val => (val ? dateUtils.readableDueDate(val) : 'Choose a date…')}
                            />
                        }
                        labelPlacement="end"
                        control={<Radio />}
                    />
                </RadioGroup>
            </FormControl>
        );
    }
}

DueDatePicker.propTypes = {
    entityId: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default DueDatePicker;
