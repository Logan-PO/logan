import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { Grid, Typography, TextField, Breadcrumbs } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { getTermSelectors, updateTerm, updateTermLocal } from '../../store/schedule';
import Editor from '../shared/editor';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class TermEditor extends Editor {
    constructor(props) {
        super(props, { id: 'tid', entity: 'term' });

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            term: {},
        };
    }

    selectEntity(id) {
        return this.props.selectTerm(id);
    }

    updateEntity(entity) {
        this.props.updateTerm(entity);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateTermLocal({ id, changes });
    }

    processChange(changes, prop, e) {
        if (prop === 'startDate' || prop === 'endDate') {
            changes[prop] = e.format(DB_DATE_FORMAT);
        } else {
            super.processChange(changes, prop, e);
        }
    }

    render() {
        const sd = _.get(this.state.term, 'startDate');
        const ed = _.get(this.state.term, 'endDate');

        const startDate = sd ? dayjs(sd, DB_DATE_FORMAT) : null;
        const endDate = ed ? dayjs(ed, DB_DATE_FORMAT) : null;

        return (
            <div className="editor">
                <div className="scroll-view">
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Breadcrumbs>
                                <Typography color="textPrimary">Edit Term</Typography>
                                <Typography color="textPrimary" />
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={this.isEmpty()}
                                label="Title"
                                fullWidth
                                value={_.get(this.state.term, 'title', '')}
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

TermEditor.propTypes = {
    tid: PropTypes.string,
    selectTerm: PropTypes.func,
    updateTermLocal: PropTypes.func,
    updateTerm: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectTerm: getTermSelectors(state.schedule).selectById,
    };
};

const mapDispatchToProps = { updateTerm, updateTermLocal };

export default connect(mapStateToProps, mapDispatchToProps)(TermEditor);
