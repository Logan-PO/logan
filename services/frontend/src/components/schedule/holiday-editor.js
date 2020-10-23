import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { Grid, Typography, TextField, Breadcrumbs } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { getScheduleSelectors, updateHoliday, updateHolidayLocal } from '../../store/schedule';
import Editor from '../shared/editor';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class HolidayEditor extends Editor {
    constructor(props) {
        super(props, { id: 'hid', entity: 'holiday' });

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            holiday: {},
        };
    }

    selectEntity(id) {
        return this.props.selectHoliday(id);
    }

    updateEntity(entity) {
        this.props.updateHoliday(entity);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateHolidayLocal({ id, changes });
    }

    processChange(changes, prop, e) {
        if (prop === 'startDate' || prop === 'endDate') {
            changes[prop] = e.format(DB_DATE_FORMAT);
        } else {
            super.processChange(changes, prop, e);
        }
    }

    render() {
        const term = this.props.selectTerm(_.get(this.state.holiday, 'tid'));

        const sd = _.get(this.state.holiday, 'startDate');
        const ed = _.get(this.state.holiday, 'endDate');

        const startDate = sd ? dayjs(sd, DB_DATE_FORMAT) : null;
        const endDate = ed ? dayjs(ed, DB_DATE_FORMAT) : null;

        return (
            <div className="editor">
                <div className="scroll-view">
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Breadcrumbs>
                                <Typography color="inherit">{_.get(term, 'title')}</Typography>
                                <Typography color="textPrimary">Edit Holiday</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={this.isEmpty()}
                                label="Title"
                                fullWidth
                                value={_.get(this.state.holiday, 'title', '')}
                                onChange={this.handleChange.bind(this, 'title')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <DatePicker
                                        fullWidth
                                        label="Start Date"
                                        variant="inline"
                                        disabled={this.isEmpty()}
                                        color="secondary"
                                        value={startDate}
                                        onChange={this.handleChange.bind(this, 'startDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DatePicker
                                        fullWidth
                                        label="End Date"
                                        variant="inline"
                                        disabled={this.isEmpty()}
                                        color="secondary"
                                        value={endDate}
                                        onChange={this.handleChange.bind(this, 'endDate')}
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

HolidayEditor.propTypes = {
    hid: PropTypes.string,
    selectTerm: PropTypes.func,
    selectHoliday: PropTypes.func,
    updateHolidayLocal: PropTypes.func,
    updateHoliday: PropTypes.func,
};

const mapStateToProps = state => {
    const { baseSelectors } = getScheduleSelectors(state.schedule);

    return {
        selectTerm: baseSelectors.terms.selectById,
        selectHoliday: baseSelectors.holidays.selectById,
    };
};

const mapDispatchToProps = { updateHoliday, updateHolidayLocal };

export default connect(mapStateToProps, mapDispatchToProps)(HolidayEditor);
