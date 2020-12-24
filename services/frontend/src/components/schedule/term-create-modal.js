import React from 'react';
import { createTerm } from '@logan/fe-shared/store/schedule';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DatePicker } from '@material-ui/pickers';
import { dateUtils } from '@logan/core';
import _ from 'lodash';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class TermCreateModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'New term',
            startDate: '2020-01-01',
            endDate: '2020-05-20',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        this.setState({
            title: 'New term',
            startDate: '2020-01-01',
            endDate: '2020-05-20',
        });
    }

    handleChange(prop, e) {
        if (prop === 'startDate' || prop === 'endDate') {
            this.setState({ [prop]: e.format(DB_DATE_FORMAT) });
        } else {
            this.setState({ [prop]: e.target.value });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.props.createTerm({
            title: this.state.title,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        });
        this.props.onClose();
    }

    render() {
        const startDate = this.state.startDate ? dayjs(this.state.startDate, DB_DATE_FORMAT) : null;
        const endDate = this.state.endDate ? dayjs(this.state.endDate, DB_DATE_FORMAT) : null;

        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth={true} maxWidth="xs">
                <DialogTitle>Create Term</DialogTitle>
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
                            <DatePicker
                                fullWidth
                                label="Start Date"
                                variant="inline"
                                color="secondary"
                                value={startDate}
                                onChange={this.handleChange.bind(this, 'startDate')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <DatePicker
                                fullWidth
                                label="End Date"
                                variant="inline"
                                color="secondary"
                                value={endDate}
                                onChange={this.handleChange.bind(this, 'endDate')}
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

TermCreateModal.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    createTerm: PropTypes.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = { createTerm };

export default connect(mapStateToProps, mapDispatchToProps)(TermCreateModal);
