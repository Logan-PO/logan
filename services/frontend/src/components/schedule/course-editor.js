import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField } from '@material-ui/core';
import { getCourseSelectors, updateCourse, updateCourseLocal } from '../../store/schedule';
import Editor from '../shared/editor';
import ColorPicker from '../shared/controls/color-picker';

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
                <div className="scroll-view">
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Typography variant="h5">Edit Course</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={this.isEmpty()}
                                label="Title"
                                fullWidth
                                value={_.get(this.state.course, 'title', '')}
                                onChange={this.handleChange.bind(this, 'title')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={this.isEmpty()}
                                label="Nickname"
                                fullWidth
                                value={_.get(this.state.course, 'nickname', '')}
                                onChange={this.handleChange.bind(this, 'nickname')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ColorPicker
                                disabled={this.isEmpty()}
                                value={_.get(this.state.course, 'color', '')}
                                onChange={this.handleChange.bind(this, 'color')}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

CourseEditor.propTypes = {
    cid: PropTypes.string,
    selectCourse: PropTypes.func,
    updateCourseLocal: PropTypes.func,
    updateCourse: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectCourse: getCourseSelectors(state.schedule).selectById,
    };
};

const mapDispatchToProps = { updateCourse, updateCourseLocal };

export default connect(mapStateToProps, mapDispatchToProps)(CourseEditor);
