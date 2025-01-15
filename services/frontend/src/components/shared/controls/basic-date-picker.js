import React from 'react';
import PropTypes from 'prop-types';
import DueDateIcon from '@material-ui/icons/CalendarToday';
import ChevronDown from '@material-ui/icons/KeyboardArrowDown';
import ChevronUp from '@material-ui/icons/KeyboardArrowUp';
import { dateUtils } from '@logan/core';
import Typography from '../typography';
import InputGroup from './input-group';
import DatePicker from './date-picker';
import styles from './basic-date-picker.module.scss';

class BasicDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.datePickerRef = React.createRef();

        this._handleChange = this._handleChange.bind(this);
    }

    _handleChange(newDate) {
        if (this.props.onChange) {
            this.props.onChange(newDate);
        }
    }

    render() {
        const { hideIcon = false, inputGroupProps = {}, labelFunc = dateUtils.humanReadableDate } = this.props;

        const formattedDate = labelFunc(this.props.value);

        return (
            <InputGroup
                {...inputGroupProps}
                icon={hideIcon ? undefined : inputGroupProps.icon || DueDateIcon}
                label={inputGroupProps.label || 'Due Date'}
                content={
                    <DatePicker
                        ref={this.datePickerRef}
                        classes={{
                            pickerContainer: styles.pickerContainer,
                            backdrop: styles.backdrop,
                        }}
                        owner={
                            <div
                                className={styles.realLabel}
                                onClick={this.datePickerRef.current && this.datePickerRef.current.openPicker}
                            >
                                <Typography>{formattedDate}</Typography>
                                <ChevronDown className={styles.icon} />
                            </div>
                        }
                        dummyOwnerForPicker={
                            <div
                                className={styles.dummyLabel}
                                onClick={this.datePickerRef.current && this.datePickerRef.current.closePicker}
                            >
                                <Typography style={{ color: 'white' }}>{formattedDate}</Typography>
                                <ChevronUp className={styles.icon} style={{ color: 'white' }} />
                            </div>
                        }
                        value={this.props.value}
                        onChange={this._handleChange}
                    />
                }
            />
        );
    }
}

BasicDatePicker.propTypes = {
    hideIcon: PropTypes.bool,
    inputGroupProps: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
    labelFunc: PropTypes.func,
};

export default BasicDatePicker;
