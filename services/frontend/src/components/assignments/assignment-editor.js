import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { dateUtils } from '@logan/core';
import {
    deleteAssignment,
    getAssignmentsSelectors,
    updateAssignment,
    updateAssignmentLocal,
} from '@logan/fe-shared/store/assignments';
import Editor from '@logan/fe-shared/components/editor';
import '../shared/editor.scss';
import RemindersList from '../reminders/reminders-list';
import CoursePicker from '../shared/controls/course-picker';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import InputGroup from '../shared/controls/input-group';
import TextInput from '../shared/controls/text-input';
import SubtasksList from './subtasks-list';
import './assignment-editor.scss';

const { DB_DATE_FORMAT } = dateUtils.constants;

//Represents a form to submit the info required to create a given assignment
class AssignmentEditor extends Editor {
    constructor(props) {
        super(props, { id: 'aid', entity: 'assignment' });

        this.datePickerRef = React.createRef();

        this.state = {
            assignment: undefined,
        };
    }

    selectEntity(id) {
        return this.props.selectAssignment(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateAssignmentLocal({ id, changes });
    }

    updateEntity(entity) {
        this.props.updateAssignment(entity);
    }

    processChange(changes, prop, e) {
        if (prop === 'dueDate') {
            changes[prop] = e.format(DB_DATE_FORMAT);
        } else if (prop === 'cid') {
            const cid = e.target.value;
            if (cid === 'none') changes[prop] = undefined;
            else changes[prop] = e.target.value;
        } else {
            changes[prop] = e.target.value;
        }
    }

    render() {
        const dueDate = _.get(this.state.assignment, 'dueDate');

        return (
            <div className="editor">
                <div className="scroll-view assignment-editor">
                    <InputGroup
                        icon={AssignmentIcon}
                        style={{ marginBottom: 0 }}
                        content={
                            <TextInput
                                fullWidth
                                onChange={this.handleChange.bind(this, 'title')}
                                value={_.get(this.state.assignment, 'title', '')}
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
                                value={_.get(this.state.assignment, 'description', '')}
                                placeholder="Description"
                                disabled={this.isEmpty()}
                                style={{ color: '#646464' }}
                            />
                        }
                    />
                    <CoursePicker
                        fullWidth
                        disabled={this.isEmpty()}
                        value={_.get(this.state.assignment, 'cid', 'none')}
                        onChange={this.handleChange.bind(this, 'cid')}
                    />
                    <BasicDatePicker
                        value={dueDate ? dateUtils.toDate(dueDate) : dateUtils.dayjs()}
                        onChange={this.handleChange.bind(this, 'dueDate')}
                    />
                    <SubtasksList aid={this.props.aid} />
                    <RemindersList eid={_.get(this.state.assignment, 'aid')} entityType="assignment" />
                </div>
            </div>
        );
    }
}
AssignmentEditor.propTypes = {
    aid: PropTypes.string,
    updateAssignmentLocal: PropTypes.func,
    selectAssignment: PropTypes.func,
    updateAssignment: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateAssignment, updateAssignmentLocal, deleteAssignment };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentEditor);
