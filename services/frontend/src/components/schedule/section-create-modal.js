import React from 'react';
import { createSection } from '@logan/fe-shared/store/schedule';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DatePicker, TimePicker } from '@material-ui/pickers';
import { dateUtils } from '@logan/core';
import _ from 'lodash';
import DowPicker from '../shared/controls/dow-picker';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

function dateOrNull(input, format) {
    return input ? dayjs(input, format) : null;
}

class SectionCreateModal extends React.Component {
    constructor(props) {
        super(props);

        const course = this.props.getCourse(this.props.cid);
        const term = this.props.getTerm(course.tid);

        this.state = {
            title: 'New section',
            cid: this.props.cid,
            tid: course.tid,
            startDate: term.startDate,
            endDate: term.endDate,
            startTime: '08:00',
            endTime: '09:00',
            daysOfWeek: [1, 3, 5],
            weeklyRepeat: 1,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        const course = this.props.getCourse(this.props.cid);
        const term = this.props.getTerm(course.tid);

        this.setState({
            title: 'New section',
            cid: this.props.cid,
            tid: course.tid,
            startDate: term.startDate,
            endDate: term.endDate,
            startTime: '08:00',
            endTime: '09:00',
            daysOfWeek: [1, 3, 5],
            weeklyRepeat: 1,
        });
    }

    handleChange(prop, e) {
        if (prop === 'startDate' || prop === 'endDate') {
            this.setState({ [prop]: e.format(DB_DATE_FORMAT) });
        } else if (prop === 'startTime' || prop === 'endTime') {
            this.setState({ [prop]: e.format(DB_TIME_FORMAT) });
        } else if (prop === 'weeklyRepeat') {
            this.setState({ [prop]: Number(e.target.value) });
        } else {
            this.setState({ [prop]: e.target.value });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        const course = this.props.getCourse(this.props.cid);

        this.props.createSection({
            title: this.state.title,
            cid: this.props.cid,
            tid: course.tid,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            daysOfWeek: this.state.daysOfWeek,
            weeklyRepeat: this.state.weeklyRepeat,
        });

        this.props.onClose();
    }

    render() {
        const startDate = this.state.startDate ? dayjs(this.state.startDate, DB_DATE_FORMAT) : null;
        const endDate = this.state.endDate ? dayjs(this.state.endDate, DB_DATE_FORMAT) : null;

        const startTime = dateOrNull(this.state.startTime, DB_TIME_FORMAT);
        const endTime = dateOrNull(this.state.endTime, DB_TIME_FORMAT);

        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth={true} maxWidth="xs">
                <DialogTitle>Create Section</DialogTitle>
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
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <DatePicker
                                        fullWidth
                                        label="Start Date"
                                        variant="inline"
                                        color="secondary"
                                        value={startDate}
                                        onChange={this.handleChange.bind(this, 'startDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TimePicker
                                        fullWidth
                                        label="Start Time"
                                        variant="inline"
                                        color="secondary"
                                        format="h:mm A"
                                        value={startTime}
                                        onChange={this.handleChange.bind(this, 'startTime')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <DatePicker
                                        fullWidth
                                        label="End Date"
                                        variant="inline"
                                        color="secondary"
                                        value={endDate}
                                        onChange={this.handleChange.bind(this, 'endDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TimePicker
                                        fullWidth
                                        label="End Time"
                                        variant="inline"
                                        color="secondary"
                                        format="h:mm A"
                                        value={endTime}
                                        onChange={this.handleChange.bind(this, 'endTime')}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        type="number"
                                        inputProps={{ min: 1, max: 52 }}
                                        label="Weekly Interval"
                                        fullWidth
                                        value={this.state.weeklyRepeat}
                                        onChange={this.handleChange.bind(this, 'weeklyRepeat')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DowPicker
                                        fullWidth
                                        value={this.state.daysOfWeek}
                                        onChange={this.handleChange.bind(this, 'daysOfWeek')}
                                    />
                                </Grid>
                            </Grid>
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

SectionCreateModal.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    createSection: PropTypes.func,
    cid: PropTypes.string,
    getCourse: PropTypes.func,
    getTerm: PropTypes.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = { createSection };

export default connect(mapStateToProps, mapDispatchToProps)(SectionCreateModal);
