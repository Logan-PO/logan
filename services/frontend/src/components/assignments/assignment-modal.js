import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { createAssignment } from '@logan/fe-shared/store/assignments';
import Dialog from '../shared/dialog';
import CoursePicker from '../shared/controls/course-picker';
import ActionButton from '../shared/controls/action-button';
import InputGroup from '../shared/controls/input-group';
import TextInput from '../shared/controls/text-input';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import TagEditor from '../shared/controls/tag-editor';
import styles from './assignment-modal.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class AssignmentModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.createAssignment = this.createAssignment.bind(this);

        this._titleRef = React.createRef();

        this.state = {
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: false,
            assignment: {
                title: 'New assignment',
                dueDate: dayjs().format(DB_DATE_FORMAT),
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
            assignment: {
                title: 'New assignment',
                dueDate: dayjs().format(DB_DATE_FORMAT),
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

    async createAssignment() {
        this.setState({ isCreating: true });
        const id = setTimeout(() => this.setState({ showLoader: true }), 500);
        await this.props.createAssignment(this.state.assignment);
        clearTimeout(id);
        this.setState({ showLoader: false, isCreating: false });
        this.props.onClose();
    }

    handleChange(prop, e) {
        const assignment = this.state.assignment;

        if (prop === 'dueDate') {
            assignment[prop] = e.format(DB_DATE_FORMAT);
        } else if (prop === 'cid') {
            const cid = e.target.value;
            if (cid === 'none') assignment[prop] = undefined;
            else assignment[prop] = e.target.value;
        } else {
            assignment[prop] = e.target.value;
        }

        this.setState({ assignment });
    }

    render() {
        const dueDate = _.get(this.state.assignment, 'dueDate');

        return (
            <Dialog
                classes={{ content: styles.modalContent }}
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
                maxWidth="sm"
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
                title="New assignment"
                content={
                    <React.Fragment>
                        <InputGroup
                            style={{ marginBottom: 0 }}
                            icon={AssignmentIcon}
                            content={
                                <TextInput
                                    fullWidth
                                    onChange={this.handleChange.bind(this, 'title')}
                                    value={_.get(this.state.assignment, 'title', '')}
                                    placeholder="Title"
                                    variant="big-input"
                                    inputRef={this._titleRef}
                                />
                            }
                        />
                        <InputGroup
                            emptyAccessory
                            style={{ marginBottom: 16 }}
                            content={
                                <TextInput
                                    fullWidth
                                    multiline
                                    onChange={this.handleChange.bind(this, 'description')}
                                    value={_.get(this.state.assignment, 'description', '')}
                                    placeholder="Description"
                                    style={{ color: '#646464' }}
                                />
                            }
                        />
                        <div className={styles.horizontalDiv}>
                            <CoursePicker
                                style={{ flexGrow: 1 }}
                                fullWidth
                                value={_.get(this.state.assignment, 'cid', 'none')}
                                onChange={this.handleChange.bind(this, 'cid')}
                            />
                            <BasicDatePicker
                                style={{ flexGrow: 1 }}
                                value={dueDate ? dateUtils.toDate(dueDate) : dateUtils.dayjs()}
                                onChange={this.handleChange.bind(this, 'dueDate')}
                            />
                        </div>
                        <TagEditor
                            tags={_.get(this.state.assignment, 'tags')}
                            onChange={this.handleChange.bind(this, 'tags')}
                        />
                    </React.Fragment>
                }
                cancelTitle="Cancel"
                actions={
                    !this.state.showLoader ? (
                        <ActionButton onClick={this.createAssignment}>Create</ActionButton>
                    ) : (
                        <CircularProgress size={24} />
                    )
                }
            />
        );
    }
}

AssignmentModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    createAssignment: PropTypes.func,
};

export default connect(null, { createAssignment })(AssignmentModal);
