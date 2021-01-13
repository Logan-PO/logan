import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { Button } from '@material-ui/core';
import DueDateIcon from '@material-ui/icons/CalendarToday';
import { DatePicker } from '@material-ui/pickers';
import Typography from '../typography';
import InputGroup from './input-group';
import styles from './due-date-picker.module.scss';

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
            <InputGroup
                label="Due Date"
                icon={DueDateIcon}
                content={
                    <div className={styles.selectables}>
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
                        <Selectable
                            selected={this.state.dueDateType === 'date'}
                            onClick={this.updateType.bind(this, 'date')}
                        >
                            <DatePicker
                                variant="inline"
                                disabled={_.get(this.state, 'dueDateType') !== 'date'}
                                value={dateValue}
                                onChange={this.updateDate}
                                color="primary"
                                labelFunc={val => (val ? dateUtils.readableDueDate(val) : 'Choose a date…')}
                            />
                        </Selectable>
                    </div>
                    // <RadioGroup
                    //     row
                    //     name="dueDateType"
                    //     value={_.get(this.state, 'dueDateType', '')}
                    //     onChange={this.updateType}
                    // >
                    //     <FormControlLabel
                    //         value="asap"
                    //         label={<Button>ASAP</Button>}
                    //         labelPlacement="end"
                    //         control={<Radio color="primary" />}
                    //     />
                    //     <FormControlLabel
                    //         value="eventually"
                    //         label="Eventually"
                    //         labelPlacement="end"
                    //         control={<Radio color="primary" />}
                    //     />
                    //     <FormControlLabel
                    //         value="date"
                    //         label={
                    //             <DatePicker
                    //                 variant="inline"
                    //                 disabled={_.get(this.state, 'dueDateType') !== 'date'}
                    //                 value={dateValue}
                    //                 onChange={this.updateDate}
                    //                 color="primary"
                    //                 labelFunc={val => (val ? dateUtils.readableDueDate(val) : 'Choose a date…')}
                    //             />
                    //         }
                    //         labelPlacement="end"
                    //         control={<Radio color="primary" />}
                    //     />
                    // </RadioGroup>
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
