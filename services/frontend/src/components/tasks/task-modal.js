import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { createTask } from '@logan/fe-shared/store/tasks';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Checkbox, CoursePicker, DueDatePicker, PriorityPicker, TagEditor } from '../shared/controls';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import ActionButton from '../shared/controls/action-button';
import Dialog from '../shared/dialog';
import styles from './task-modal.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class TaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.createTask = this.createTask.bind(this);

        const newTitle = props.aid ? 'New subtask' : 'New task';

        this._titleRef = React.createRef();

        this.state = {
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: false,
            task: {
                aid: props.aid,
                title: newTitle,
                dueDate: dayjs().format(DB_DATE_FORMAT),
                priority: 0,
                tags: [],
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
        const newTitle = this.props.aid ? 'New subtask' : 'New task';

        this.setState({
            fakeId: Math.random().toString(),
            isCreating: false,
            showLoader: false,
            justOpened: true,
            task: {
                aid: this.props.aid,
                title: newTitle,
                dueDate: dayjs().format(DB_DATE_FORMAT),
                priority: 0,
                tags: [],
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

    async createTask() {
        this.setState({ isCreating: true });
        const id = setTimeout(() => this.setState({ showLoader: true }), 500);
        await this.props.createTask(this.state.task);
        clearTimeout(id);
        this.setState({ showLoader: false, isCreating: false });
        this.props.onClose();
    }

    handleChange(prop, e) {
        const task = this.state.task;

        if (prop === 'dueDate' || prop === 'tags') {
            task[prop] = e;
        } else if (prop === 'cid') {
            const cid = e.target.value;
            if (cid === 'none') task[prop] = undefined;
            else task[prop] = e.target.value;
        } else {
            task[prop] = e.target.value;
        }

        this.setState({ task });
    }

    render() {
        const isSubtask = !!this.props.aid;
        const { cid } = this.state.task;

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                disableBackdropClick={this.state.isCreating}
                disableEscapeKeyDown
                title={isSubtask ? 'New Subtask' : 'New Task'}
                content={
                    <React.Fragment>
                        <InputGroup
                            style={{ marginBottom: 0 }}
                            accessory={
                                <Checkbox
                                    size="large"
                                    checked={_.get(this.state.task, 'complete', false)}
                                    onChange={this.handleChange.bind(this, 'complete')}
                                />
                            }
                            content={
                                <TextInput
                                    fullWidth
                                    onChange={this.handleChange.bind(this, 'title')}
                                    value={_.get(this.state.task, 'title')}
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
                                    value={_.get(this.state.task, 'description')}
                                    placeholder="Description"
                                    style={{ color: '#646464' }}
                                />
                            }
                        />
                        <CoursePicker fullWidth value={cid || 'none'} onChange={this.handleChange.bind(this, 'cid')} />
                        <DueDatePicker
                            entityId={_.get(this.state.task, 'tid')}
                            value={_.get(this.state.task, 'dueDate')}
                            onChange={this.handleChange.bind(this, 'dueDate')}
                        />
                        <TagEditor
                            tags={_.get(this.state.task, 'tags')}
                            onChange={this.handleChange.bind(this, 'tags')}
                        />
                        <PriorityPicker
                            value={_.get(this.state.task, 'priority')}
                            onChange={this.handleChange.bind(this, 'priority')}
                        />
                    </React.Fragment>
                }
                cancelTitle="Cancel"
                actions={
                    !this.state.showLoader ? (
                        <ActionButton onClick={this.createTask} disabled={this.state.showLoader}>
                            Create
                        </ActionButton>
                    ) : (
                        <CircularProgress size={24} className={styles.buttonProgress} />
                    )
                }
            />
        );
    }
}

TaskModal.propTypes = {
    aid: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    createTask: PropTypes.func,
};

export default connect(null, { createTask })(TaskModal);
