import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Typography, TextField, Breadcrumbs, Divider } from '@material-ui/core';
import { getScheduleSelectors, updateCourse, updateCourseLocal } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import '../shared/editor.scss';
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
        const term = this.props.selectTerm(_.get(this.state.course, 'tid'));

        return (
            <div className="editor">
                <div className="scroll-view">
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Breadcrumbs>
                                <Typography color="inherit">{_.get(term, 'title')}</Typography>
                                <Typography color="textPrimary">Edit Course</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Divider flexItem style={{ margin: '0 -1em' }} />
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
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        disabled={this.isEmpty()}
                                        label="Nickname"
                                        fullWidth
                                        value={_.get(this.state.course, 'nickname', '')}
                                        onChange={this.handleChange.bind(this, 'nickname')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <ColorPicker
                                        fullWidth
                                        disabled={this.isEmpty()}
                                        value={_.get(this.state.course, 'color', '')}
                                        onChange={this.handleChange.bind(this, 'color')}
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
