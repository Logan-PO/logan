import _ from 'lodash';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import { getScheduleSelectors, updateCourse, updateCourseLocal, deleteSection } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import ColorPicker from '../shared/controls/color-picker';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import Typography from '../shared/typography';
import TextButton from '../shared/controls/text-button';
import '../shared/editor.scss';
import editorStyles from './page-editor.module.scss';
import listStyles from './page-list.module.scss';

class CourseEditor extends Editor {
    constructor(props) {
        super(props, { id: 'cid', entity: 'course' });

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            course: {},
        };
    }

    selectEntity(id) {
        return this.props.selectCourse(id);
    }

    updateEntity(entity) {
        this.props.updateCourse(entity);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateCourseLocal({ id, changes });
    }

    _selectSection(event, sid) {
        if (event.target.tagName === 'BUTTON') return; // Ignore clicks on actions within the cells

        this.props.onSelectSection(sid);
    }

    renderSectionsList() {
        const sections = this.props.getSectionsForCourse({ cid: this.props.cid });

        return (
            <InputGroup
                label="Sections"
                content={
                    <div className={`small-list ${editorStyles.smallerList}`}>
                        {sections.map(section => (
                            <div
                                key={section.sid}
                                className={clsx('list-item', listStyles.cell, editorStyles.smallerCell)}
                                onClick={event => this._selectSection(event, section.sid)}
                            >
                                <Typography>{section.title}</Typography>
                                <ChevronRightIcon fontSize="small" />
                                <div className="actions">
                                    <Tooltip title="Delete">
                                        <IconButton
                                            size="small"
                                            className="action"
                                            onClick={() => this.props.deleteSection(section)}
                                        >
                                            <DeleteIcon fontSize="small" color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                        <TextButton classes={{ root: listStyles.addButton }} size="large" IconComponent={AddIcon}>
                            Add section
                        </TextButton>
                    </div>
                }
            />
        );
    }

    render() {
        return (
            <div className="editor">
                <div className={`scroll-view ${editorStyles.editor}`}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <TextInput
                                style={{ marginBottom: 16 }}
                                variant="big-input"
                                fullWidth
                                value={_.get(this.state.course, 'title', '')}
                                onChange={this.handleChange.bind(this, 'title')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <InputGroup
                                        style={{ marginBottom: 12 }}
                                        label="Nickname"
                                        content={
                                            <TextInput
                                                fullWidth
                                                value={_.get(this.state.course, 'nickname', '')}
                                                onChange={this.handleChange.bind(this, 'nickname')}
                                            />
                                        }
                                    />
                                    <ColorPicker
                                        fullWidth
                                        label="Color"
                                        disabled={this.isEmpty()}
                                        value={_.get(this.state.course, 'color', '')}
                                        onChange={this.handleChange.bind(this, 'color')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {this.renderSectionsList()}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

CourseEditor.propTypes = {
    cid: PropTypes.string,
    onSelectSection: PropTypes.func,
    selectTerm: PropTypes.func,
    selectCourse: PropTypes.func,
    updateCourseLocal: PropTypes.func,
    updateCourse: PropTypes.func,
    getSectionsForCourse: PropTypes.func,
    deleteSection: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        selectTerm: selectors.baseSelectors.terms.selectById,
        selectCourse: selectors.baseSelectors.courses.selectById,
        getSectionsForCourse: selectors.getSectionsForCourse,
    };
};

const mapDispatchToProps = { updateCourse, updateCourseLocal, deleteSection };

export default connect(mapStateToProps, mapDispatchToProps)(CourseEditor);
