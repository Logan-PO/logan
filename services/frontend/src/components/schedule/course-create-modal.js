import React from 'react';
import { createCourse } from '@logan/fe-shared/store/schedule';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import ColorPicker from '../shared/controls/color-picker';

class CourseCreateModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'New term',
            startDate: '2020-01-01',
            endDate: '2020-05-20',
            color: '#000000',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        this.setState({
            title: 'New course',
            startDate: '2020-01-01',
            endDate: '2020-05-20',
            color: '',
            nickname: '',
        });
    }

    handleChange(prop, e) {
        this.setState({ [prop]: e.target.value });
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.props.createCourse({
            tid: this.props.tid,
            title: this.state.title,
            color: this.state.color,
            nickname: this.state.nickname,
        });
        this.props.onClose();
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth={true} maxWidth="xs">
                <DialogTitle>Create Course</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                onChange={this.handleChange.bind(this, 'title')}
                                value={this.state.title}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Nickname"
                                fullWidth
                                value={this.state.nickname}
                                onChange={this.handleChange.bind(this, 'nickname')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ColorPicker
                                fullWidth
                                value={this.state.color}
                                onChange={this.handleChange.bind(this, 'color')}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.handleSubmit}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

CourseCreateModal.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    createCourse: PropTypes.func,
    tid: PropTypes.string,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = { createCourse };

export default connect(mapStateToProps, mapDispatchToProps)(CourseCreateModal);
