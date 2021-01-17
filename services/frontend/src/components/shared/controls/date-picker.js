import React from 'react';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { ButtonBase, Popover } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { getCurrentTheme } from '../../../globals/theme';
import Typography from '../typography';
import ActionButton from './action-button';
import styles from './date-picker.module.scss';

class DatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.ownerContainerRef = React.createRef();

        this.openPicker = this.openPicker.bind(this);
        this.closePicker = this.closePicker.bind(this);

        this._selectDay = this._selectDay.bind(this);
        this._changeMonth = this._changeMonth.bind(this);
        this._generateDays = this._generateDays.bind(this);
        this._generateDay = this._generateDay.bind(this);

        const initialDate = props.value || dateUtils.dayjs();

        this.state = {
            pickerOpen: false,
            backdropSize: { width: 0, height: 0 },
            shownMonthStart: dateUtils.formatAsDate(initialDate.date(1)),
            selectedDate: dateUtils.formatAsDate(initialDate),
        };
    }

    componentDidMount() {
        this._updateBackdropSizeIfNecessary();
    }

    componentDidUpdate(prevProps) {
        let changed = false;

        if (prevProps.value && this.props.value) {
            changed = !prevProps.value.isSame(this.props.value, 'day');
        } else {
            changed = prevProps.value || this.props.value;
        }

        if (changed) {
            this.setState({
                selectedDate: dateUtils.formatAsDate(this.props.value),
            });
        }

        this._updateBackdropSizeIfNecessary();
    }

    _updateBackdropSizeIfNecessary() {
        if (this.ownerContainerRef.current) {
            const node = this.ownerContainerRef.current;

            if (this.state.backdropSize.width !== node.offsetWidth) {
                this.setState({
                    backdropSize: {
                        width: node.offsetWidth,
                        height: node.offsetHeight,
                    },
                });
            }
        }
    }

    openPicker() {
        this.setState({ pickerOpen: true });
    }

    closePicker() {
        this.setState({ pickerOpen: false });
    }

    _generateDays() {
        const weeks = [];

        const today = dateUtils.dayjs();
        const selectedDate = dateUtils.toDate(this.state.selectedDate);
        const shownStart = dateUtils.toDate(this.state.shownMonthStart);
        let firstDateToShow = shownStart;
        let lastDateToShow = shownStart.add(1, 'month').subtract(1, 'day');

        // Backtrack to Sunday
        while (firstDateToShow.day() > 0) firstDateToShow = firstDateToShow.subtract(1, 'day');

        // Move forward to Friday
        while (lastDateToShow.day() < 6) lastDateToShow = lastDateToShow.add(1, 'day');

        let runner = firstDateToShow;

        let currentDays = [];

        while (runner.isSameOrBefore(lastDateToShow, 'day')) {
            const isCurrentMonth = runner.month() === shownStart.month();

            const isToday = runner.isSame(today, 'day');
            const isSelected = runner.isSame(selectedDate, 'day');

            currentDays.push(this._generateDay(runner, isToday, isCurrentMonth, isSelected));

            if (runner.day() === 6) {
                weeks.push(<div className={styles.calendarWeek}>{currentDays}</div>);
                currentDays = [];
            }

            runner = runner.add(1, 'day');
        }

        return weeks;
    }

    _generateDay(date, isToday, isCurrentMonth, isSelected) {
        const classes = [styles.dayCircle];

        if (isToday) classes.push(styles.today);
        if (!isCurrentMonth) classes.push(styles.outsideMonth);
        if (isSelected) classes.push(styles.selectedDay);

        return (
            <ButtonBase className={classes.join(' ')} onClick={() => this._selectDay(date)}>
                <Typography variant="body2">{date.date()}</Typography>
            </ButtonBase>
        );
    }

    _changeMonth(amount) {
        this.setState({
            shownMonthStart: dateUtils.formatAsDate(dateUtils.toDate(this.state.shownMonthStart).add(amount, 'month')),
        });
    }

    _selectDay(dateObject) {
        this.setState({
            shownMonthStart: dateUtils.formatAsDate(dateObject.date(1)),
            selectedDate: dateUtils.formatAsDate(dateObject),
        });

        if (this.props.onChange) {
            this.props.onChange(dateObject);
        }
    }

    render() {
        const theme = getCurrentTheme();
        const headerText = dateUtils.toDate(this.state.shownMonthStart).format('MMM YYYY');

        const selectedDate = dateUtils.toDate(this.state.selectedDate);
        const todaySelected = selectedDate.isSame(dateUtils.dayjs(), 'day');
        const tomorrowSelected = selectedDate.isSame(dateUtils.dayjs().add(1, 'day'), 'day');

        const defaultActionButtonProps = { color: 'white', textColor: 'black' };
        const selectedActionButtonProps = { color: 'secondary' };

        return (
            <React.Fragment>
                <div className={styles.ownerContainer} ref={this.ownerContainerRef}>
                    {this.props.owner}
                </div>
                <Popover
                    open={this.state.pickerOpen}
                    anchorEl={this.ownerContainerRef.current}
                    classes={{ paper: styles.pickerPaper }}
                    elevation={0}
                    onClose={this.closePicker}
                >
                    <div
                        className={styles.pickerContainer}
                        style={{
                            '--primary-color': theme.palette.primary.main,
                            '--primary-contrast': theme.palette.primary.contrastText,
                            '--secondary-color': theme.palette.secondary.main,
                            '--secondary-contrast': theme.palette.secondary.contrastText,
                            top: this.props.offset.y,
                            left: this.props.offset.x,
                        }}
                    >
                        <div className={styles.backdropContainer}>
                            <div
                                className={styles.backdrop}
                                style={{
                                    paddingTop: -this.props.offset.y,
                                    paddingLeft: -this.props.offset.x,
                                    width: this.state.backdropSize.width - this.props.offset.x,
                                    height: this.state.backdropSize.height - this.props.offset.y,
                                }}
                            >
                                {this.props.dummyOwnerForPicker}
                            </div>
                            <svg width={4} height={4} style={{ fill: 'currentColor' }}>
                                <path
                                    d="M 0 4
                                   L 0 0
                                   A 4 4 0 0 0 4 4
                                   L 0 4"
                                />
                            </svg>
                        </div>
                        <div className={styles.pickerContent} style={{ top: this.state.backdropSize.height }}>
                            <div className={styles.header}>
                                <ButtonBase className={styles.iconButton}>
                                    <ChevronLeft className={styles.icon} onClick={this._changeMonth.bind(this, -1)} />
                                </ButtonBase>
                                <Typography>{headerText}</Typography>
                                <ButtonBase className={styles.iconButton}>
                                    <ChevronRight className={styles.icon} onClick={this._changeMonth.bind(this, 1)} />
                                </ButtonBase>
                            </div>
                            <div className={styles.calendar}>
                                <div className={styles.dowContainer}>
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((txt, i) => (
                                        <Typography key={i} variant="detail" className={styles.dowLabel}>
                                            {txt}
                                        </Typography>
                                    ))}
                                </div>
                                {this._generateDays()}
                            </div>
                            <div className={styles.pickerButtons}>
                                <ActionButton
                                    size="small"
                                    {...(todaySelected ? selectedActionButtonProps : defaultActionButtonProps)}
                                    onClick={() => this._selectDay(dateUtils.dayjs())}
                                >
                                    Today
                                </ActionButton>
                                <ActionButton
                                    size="small"
                                    {...(tomorrowSelected ? selectedActionButtonProps : defaultActionButtonProps)}
                                    onClick={() => this._selectDay(dateUtils.dayjs().add(1, 'day'))}
                                >
                                    Tomorrow
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                </Popover>
            </React.Fragment>
        );
    }
}

DatePicker.propTypes = {
    offset: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
    owner: PropTypes.node.isRequired,
    dummyOwnerForPicker: PropTypes.node,
    onPickerStateChange: PropTypes.func,
};

export default DatePicker;
