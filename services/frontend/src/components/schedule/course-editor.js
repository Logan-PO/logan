import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { getScheduleSelectors, updateCourse, updateCourseLocal } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import '../shared/editor.scss';
import ColorPicker from '../shared/controls/color-picker';
import TextInput from '../shared/controls/text-input';
import InputGroup from '../shared/controls/input-group';
import editorStyles from './page-editor.module.scss';

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

    render() {
        return (
            <div className="editor">
                <div className={`scroll-view ${editorStyles.editor}`}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <TextInput
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
                                    <InputGroup label="Sections" />
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
    selectTerm: PropTypes.func,
    selectCourse: PropTypes.func,
    updateCourseLocal: PropTypes.func,
    updateCourse: PropTypes.func,
};

const mapStateToProps = state => {
    const { baseSelectors } = getScheduleSelectors(state.schedule);

    return {
        selectTerm: baseSelectors.terms.selectById,
        selectCourse: baseSelectors.courses.selectById,
    };
};

const mapDispatchToProps = { updateCourse, updateCourseLocal };

export default connect(mapStateToProps, mapDispatchToProps)(CourseEditor);
