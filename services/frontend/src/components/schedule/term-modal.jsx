import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '../shared/dialog';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import ActionButton from '../shared/controls/action-button';
import editorStyles from './page-editor.module.scss';
import { createTerm } from 'packages/fe-shared/store/schedule';
import { dateUtils } from 'packages/core';

class TermModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createTerm = this.createTerm.bind(this);

        this._titleRef = React.createRef();

        this.state = {
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: false,
            term: {
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
            term: {
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
        const term = this.state.term;

        if (prop === 'startDate' || prop === 'endDate') {
            term[prop] = e;
        } else {
            term[prop] = e.target.value;
        }

        this.setState({ term });
    }

    async createTerm() {
        this.setState({ isCreating: true });
        const timeout = setTimeout(() => this.setState({ showLoader: true }), 500);
        await this.props.createTerm(this.state.term);
        clearTimeout(timeout);
        this.setState({ showLoader: false, isCreating: false });
        this.close();
    }

    render() {
        const sd = _.get(this.state.term, 'startDate');
        const ed = _.get(this.state.term, 'endDate');

        const startDate = sd ? dateUtils.toDate(sd) : dateUtils.dayjs();
        const endDate = ed ? dateUtils.toDate(ed) : dateUtils.dayjs();

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
                title="New term"
                cancelTitle="Cancel"
                content={
                    <React.Fragment>
                        <InputGroup
                            label="Title"
                            content={
                                <TextInput
                                    style={{ marginBottom: 16 }}
                                    variant="big-input"
                                    placeholder="New term"
                                    fullWidth
                                    value={_.get(this.state.term, 'title', '')}
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
                        <ActionButton onClick={this.createTerm} disabled={this.state.showLoader}>
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

TermModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    createTerm: PropTypes.func,
};

const mapDispatchToProps = {
    createTerm,
};

export default connect(undefined, mapDispatchToProps)(TermModal);
