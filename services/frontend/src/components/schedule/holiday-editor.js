import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { Grid } from '@material-ui/core';
import { getScheduleSelectors, updateHoliday, updateHolidayLocal } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import TextInput from '../shared/controls/text-input';
import BasicDatePicker from '../shared/controls/basic-date-picker';
import '../shared/editor.scss';
import editorStyles from './page-editor.module.scss';

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
        const sd = _.get(this.state.holiday, 'startDate');
        const ed = _.get(this.state.holiday, 'endDate');

        const startDate = sd ? dayjs(sd, DB_DATE_FORMAT) : dayjs();
        const endDate = ed ? dayjs(ed, DB_DATE_FORMAT) : dayjs();

        return (
            <div className="editor">
                <div className={`scroll-view ${editorStyles.editor}`}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <TextInput
                                variant="big-input"
                                placeholder="Title"
                                value={_.get(this.state.holiday, 'title', '')}
                                onChange={this.handleChange.bind(this, 'title')}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <BasicDatePicker
                                        labelFunc={date => date.format('MMM D, YYYY')}
                                        inputGroupProps={{ label: 'Start date' }}
                                        value={startDate}
                                        onChange={this.handleChange.bind(this, 'startDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <BasicDatePicker
                                        labelFunc={date => date.format('MMM D, YYYY')}
                                        inputGroupProps={{ label: 'End date' }}
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
