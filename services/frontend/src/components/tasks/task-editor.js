import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@material-ui/core';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, updateTaskLocal, updateTask, deleteTask } from '../../store/tasks';
import { getAssignmentsSelectors } from '../../store/assignments';
import Editor from '../shared/editor';
import { CoursePicker, DueDatePicker, PriorityPicker, Checkbox, TagEditor } from '../shared/controls';
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
                <div className="scroll-view">
                    <Grid container spacing={2} direction="column">
                        {relatedAssignment && (
                            <Grid item xs={12}>
                                <AssignmentPreview aid={relatedAssignment.aid} />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Grid container spacing={1} direction="row" justify="flex-start" alignItems="flex-end">
                                <Grid item>
                                    <Checkbox
                                        disabled={this.isEmpty()}
                                        cid={cid}
                                        checked={_.get(this.state.task, 'complete', false)}
                                        onChange={this.handleChange.bind(this, 'complete')}
                                    />
                                </Grid>
                                <Grid item style={{ flexGrow: 1 }}>
                                    <TextField
                                        label="Title"
                                        fullWidth
                                        onChange={this.handleChange.bind(this, 'title')}
                                        value={_.get(this.state.task, 'title', '')}
                                        placeholder="Untitled task"
                                        disabled={this.isEmpty()}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                onChange={this.handleChange.bind(this, 'description')}
                                value={_.get(this.state.task, 'description', '')}
                                placeholder="Task description"
                                disabled={this.isEmpty()}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2} style={{ marginTop: 4 }}>
                                <Grid item xs={6}>
                                    <CoursePicker
                                        fullWidth
                                        disabled={this.isEmpty() || !!relatedAssignment}
                                        value={cid || 'none'}
                                        onChange={this.handleChange.bind(this, 'cid')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TagEditor
                                        disabled={this.isEmpty()}
                                        tags={_.get(this.state.task, 'tags')}
                                        onChange={this.handleChange.bind(this, 'tags')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2} style={{ marginTop: 4 }}>
                                <Grid item xs={6}>
                                    <DueDatePicker
                                        entityId={_.get(this.state.task, 'tid')}
                                        disabled={this.isEmpty()}
                                        value={_.get(this.state.task, 'dueDate')}
                                        onChange={this.handleChange.bind(this, 'dueDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <PriorityPicker
                                        disabled={this.isEmpty()}
                                        value={_.get(this.state.task, 'priority')}
                                        onChange={this.handleChange.bind(this, 'priority')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
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
