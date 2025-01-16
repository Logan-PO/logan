import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonBase } from '@mui/material';
import DueDateIcon from '@mui/icons-material/CalendarToday';
import ChevronDown from '@mui/icons-material/KeyboardArrowDown';
import ChevronUp from '@mui/icons-material/KeyboardArrowUp';
import { getCurrentTheme } from '../../../globals/theme';
import Typography from '../typography';
import InputGroup from './input-group';
import DatePicker from './date-picker';
import styles from './due-date-picker.module.scss';
import { dateUtils } from 'packages/core';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

// eslint-disable-next-line react/prop-types
const Selectable = ({ selected, children, ...rest }) => {
    return (
        <Button className={`${styles.selectable} ${selected ? styles.selected : ''}`} variant="outlined" {...rest}>
            <Typography variant="body2">{children}</Typography>
        </Button>
    );
};

class DueDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this._pickerRef = React.createRef();

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

    updateType(newType) {
        const typeChanged = this.state.dueDateType !== newType;

        if (!typeChanged) return;

        this.setState({ dueDateType: newType });

        if (newType === 'date') {
            let lastDueDate = this.state.lastDueDate;
            if (!lastDueDate) {
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
        const dateValue = dayjs(lastDueDate);

        const theme = getCurrentTheme();
        const body2Height = theme.typography.body2.fontSize;

        return (
            <InputGroup
                label="Due Date"
                icon={DueDateIcon}
                content={
                    <div className={styles.selectables}>
                        <DatePicker
                            ref={this._pickerRef}
                            owner={
                                <Selectable
                                    selected={this.state.dueDateType === 'date'}
                                    onClick={
                                        this.state.dueDateType === 'date'
                                            ? this._pickerRef.current && this._pickerRef.current.openPicker
                                            : this.updateType.bind(this, 'date')
                                    }
                                >
                                    {dateValue ? dateUtils.readableDueDate(dateValue) : 'Choose a date…'}
                                    <ButtonBase
                                        className={styles.chevronButton}
                                        style={{ '--size': body2Height }}
                                        onClick={this._pickerRef.current && this._pickerRef.current.openPicker}
                                    >
                                        <ChevronDown />
                                    </ButtonBase>
                                </Selectable>
                            }
                            dummyOwnerForPicker={
                                <Selectable selected>
                                    {dateValue ? dateUtils.readableDueDate(dateValue) : 'Choose a date…'}
                                    <ButtonBase
                                        className={styles.chevronButton}
                                        style={{ '--size': body2Height }}
                                        onClick={this._pickerRef.current && this._pickerRef.current.closePicker}
                                    >
                                        <ChevronUp />
                                    </ButtonBase>
                                </Selectable>
                            }
                            classes={{
                                pickerContainer: styles.datePickerPickerContainer,
                                backdrop: styles.datePickerBackdrop,
                            }}
                            disabled={_.get(this.state, 'dueDateType') !== 'date'}
                            value={dateValue}
                            onChange={this.updateDate}
                            color="primary"
                            labelFunc={val => (val ? dateUtils.readableDueDate(val) : 'Choose a date…')}
                        />
                        <Selectable
                            selected={this.state.dueDateType === 'asap'}
                            onClick={this.updateType.bind(this, 'asap')}
                        >
                            ASAP
                        </Selectable>
                        <Selectable
                            selected={this.state.dueDateType === 'eventually'}
                            onClick={this.updateType.bind(this, 'eventually')}
                        >
                            Eventually
                        </Selectable>
                    </div>
                }
            />
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
