import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateUtils } from '@logan/core';
import { createHoliday } from '@logan/fe-shared/store/schedule';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '../shared/dialog';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import ActionButton from '../shared/controls/action-button';
import editorStyles from './page-editor.module.scss';

class HolidayModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createHoliday = this.createHoliday.bind(this);

        this._titleRef = React.createRef();

        this.state = {
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: false,
            holiday: {
                tid: props.tid,
                title: '',
                startDate: dateUtils.formatAsDate(),
                endDate: dateUtils.formatAsDate(),
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.componentWillOpen();
        } else if (this.state.justOpened) {
            this.componentDidOpen();
        }
    }

    componentWillOpen() {
        this.setState({
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: true,
            holiday: {
                tid: this.props.tid,
                title: '',
                startDate: dateUtils.formatAsDate(),
                endDate: dateUtils.formatAsDate(),
            },
        });
    }

    componentDidOpen() {
        this._titleRef.current && this._titleRef.current.select();
        this.setState({ justOpened: false });
    }

    close() {
        this.props.onClose();
    }

    handleChange(prop, e) {
        const holiday = this.state.holiday;

        if (prop === 'startDate' || prop === 'endDate') {
            holiday[prop] = e;
        } else {
            holiday[prop] = e.target.value;
        }

        this.setState({ holiday });
    }

    async createHoliday() {
        this.setState({ isCreating: true });
        const timeout = setTimeout(() => this.setState({ showLoader: true }), 500);
        await this.props.createHoliday(this.state.holiday);
        clearTimeout(timeout);
        this.setState({ showLoader: false, isCreating: false });
        this.close();
    }

    render() {
        const sd = _.get(this.state.holiday, 'startDate');
        const ed = _.get(this.state.holiday, 'endDate');

        const startDate = sd ? dateUtils.toDate(sd) : dateUtils.dayjs();
        const endDate = ed ? dateUtils.toDate(ed) : dateUtils.dayjs();

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
                title="New holiday"
                cancelTitle="Cancel"
                content={
                    <React.Fragment>
                        <InputGroup
                            label="Title"
                            content={
                                <TextInput
                                    style={{ marginBottom: 16 }}
                                    variant="big-input"
                                    placeholder="New holiday"
                                    fullWidth
                                    value={_.get(this.state.holiday, 'title', '')}
                                    onChange={this.handleChange.bind(this, 'title')}
                                    inputRef={this._titleRef}
                                />
                            }
                        />
                        <div className={editorStyles.twoCol}>
                            <div className={editorStyles.column}>
                                <BasicDatePicker
                                    labelFunc={date => date.format('MMM D, YYYY')}
                                    value={startDate}
                                    onChange={this.handleChange.bind(this, 'startDate')}
                                    hideIcon
                                    inputGroupProps={{ label: 'Start Date' }}
                                />
                            </div>
                            <div className={editorStyles.column}>
                                <BasicDatePicker
                                    labelFunc={date => date.format('MMM D, YYYY')}
                                    value={endDate}
                                    onChange={this.handleChange.bind(this, 'endDate')}
                                    hideIcon
                                    inputGroupProps={{ label: 'End Date' }}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                }
                actions={
                    !this.state.showLoader ? (
                        <ActionButton onClick={this.createHoliday} disabled={this.state.showLoader}>
                            Create
                        </ActionButton>
                    ) : (
                        <CircularProgress size={24} />
                    )
                }
            />
        );
    }
}

HolidayModal.propTypes = {
    tid: PropTypes.string.isRequired,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    createHoliday: PropTypes.func,
};

const mapDispatchToProps = {
    createHoliday,
};

export default connect(undefined, mapDispatchToProps)(HolidayModal);
