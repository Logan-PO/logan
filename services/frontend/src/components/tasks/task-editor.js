import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from 'packages/core';
import { getTasksSelectors, updateTaskLocal, updateTask, deleteTask } from 'packages/fe-shared/store/tasks';
import { getAssignmentsSelectors } from 'packages/fe-shared/store/assignments';
import Editor from 'packages/fe-shared/components/editor';
import '../shared/editor.scss';
import { CoursePicker, DueDatePicker, PriorityPicker, Checkbox, TagEditor } from '../shared/controls';
import RemindersList from '../reminders/reminders-list';
import './task-editor.scss';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import AssignmentPreview from './assignment-preview';

const {
    dayjs,
    constants: { DB_DATETIME_FORMAT },
} = dateUtils;

class TaskEditor extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'task' });

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            task: {},
        };
    }

    selectEntity(id) {
        return this.props.selectTask(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateTaskLocal({ id, changes });
    }

    updateEntity(entity) {
        this.props.updateTask(entity);
    }

    processChange(changes, prop, e) {
        if (prop === 'complete') {
            changes[prop] = e.target.checked;

            if (e.target.checked) {
                changes.completionDate = dayjs().format(DB_DATETIME_FORMAT);
            }
        } else if (prop === 'dueDate' || prop === 'tags') {
            changes[prop] = e;
        } else if (prop === 'cid') {
            const cid = e.target.value;
            if (cid === 'none') changes[prop] = undefined;
            else changes[prop] = e.target.value;
        } else {
            super.processChange(changes, prop, e);
        }
    }

    render() {
        const relatedAssignment = this.props.selectAssignment(_.get(this.state.task, 'aid'));
        const cid = relatedAssignment ? relatedAssignment.cid : _.get(this.state.task, 'cid');

        return (
            <div className="editor">
                <div className="scroll-view task-editor">
                    <InputGroup
                        style={{ marginBottom: 0 }}
                        accessory={
                            <Checkbox
                                size="large"
                                disabled={this.isEmpty()}
                                cid={cid}
                                checked={_.get(this.state.task, 'complete', false)}
                                onChange={this.handleChange.bind(this, 'complete')}
                            />
                        }
                        content={
                            <TextInput
                                fullWidth
                                onChange={this.handleChange.bind(this, 'title')}
                                value={_.get(this.state.task, 'title', '')}
                                placeholder="Title"
                                disabled={this.isEmpty()}
                                variant="big-input"
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
                                value={_.get(this.state.task, 'description', '')}
                                placeholder="Description"
                                disabled={this.isEmpty()}
                                style={{ color: '#646464' }}
                            />
                        }
                    />
                    {relatedAssignment && <AssignmentPreview aid={relatedAssignment.aid} />}
                    <CoursePicker
                        fullWidth
                        disabled={this.isEmpty() || !!relatedAssignment}
                        value={cid || 'none'}
                        onChange={this.handleChange.bind(this, 'cid')}
                    />
                    <DueDatePicker
                        entityId={_.get(this.state.task, 'tid')}
                        disabled={this.isEmpty()}
                        value={_.get(this.state.task, 'dueDate')}
                        onChange={this.handleChange.bind(this, 'dueDate')}
                    />
                    <TagEditor
                        disabled={this.isEmpty()}
                        tags={_.get(this.state.task, 'tags')}
                        onChange={this.handleChange.bind(this, 'tags')}
                    />
                    <PriorityPicker
                        disabled={this.isEmpty()}
                        value={_.get(this.state.task, 'priority')}
                        onChange={this.handleChange.bind(this, 'priority')}
                    />
                    <RemindersList eid={_.get(this.state.task, 'tid')} entityType="task" />
                </div>
            </div>
        );
    }
}

TaskEditor.propTypes = {
    tid: PropTypes.string,
    updateTaskLocal: PropTypes.func,
    selectTask: PropTypes.func,
    selectAssignment: PropTypes.func,
    updateTask: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectTask: getTasksSelectors(state.tasks).selectById,
        selectAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateTask, updateTaskLocal, deleteTask };

export default connect(mapStateToProps, mapDispatchToProps)(TaskEditor);
