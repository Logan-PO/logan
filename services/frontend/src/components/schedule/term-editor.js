import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import { Grid, Typography, TextField } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import UpdateTimer from '../../utils/update-timer';
import { getTermSelectors, updateTerm, updateTermLocal, deleteTerm } from '../../store/schedule';
import './editor.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

class TermEditor extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.changesExist = false;
        this.updateTimer = new UpdateTimer(1000, () => {
            this.props.updateTerm(this.state.term);
            this.changesExist = false;
        });

        this.state = {
            term: {},
        };
    }

    isEmpty() {
        return _.isEmpty(this.props.tid);
    }

    updateCurrentTerm(term) {
        this.setState({
            term,
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.tid !== prevProps.tid) {
            // If the user has selected a new task and updates to the existing task haven't been saved yet, save them
            if (prevProps.tid && this.changesExist) {
                const prev = this.props.selectTerm(prevProps.tid);

                if (prev) this.updateTimer.fire();

                this.updateTimer.stop();
            }

            const current = this.props.selectTerm(this.props.tid);
            this.updateCurrentTerm(current);
        } else {
            // Also if the task has been updated somewhere else, make sure the state reflects that
            const stored = this.props.selectTerm(this.props.tid);
            if (!_.isEqual(stored, this.state.term)) {
                this.updateCurrentTerm(stored);
            }
        }
    }

    handleChange(prop, e) {
        this.changesExist = true;

        const changes = {};

        if (prop === 'startDate' || prop === 'endDate') {
            changes[prop] = e.format(DB_DATE_FORMAT);
        } else {
            changes[prop] = e.target.value;
        }

        this.props.updateTermLocal({
            id: this.props.tid,
            changes,
        });

        this.updateCurrentTerm(_.merge({}, this.state.term, changes));

        this.updateTimer.reset();
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
                            <Typography variant="h5">Edit Term</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                disabled={this.isEmpty()}
                                label="Title"
                                fullWidth
                                value={_.get(this.state.term, 'title', '')}
                                onChange={this.handleChange.bind(this, 'title')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={6}>
                                    <DatePicker
                                        label="Start date"
                                        variant="inline"
                                        disabled={this.isEmpty()}
                                        color="secondary"
                                        value={startDate}
                                        onChange={this.handleChange.bind(this, 'startDate')}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DatePicker
                                        label="End date"
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

const mapDispatchToProps = { updateTerm, updateTermLocal, deleteTerm };

export default connect(mapStateToProps, mapDispatchToProps)(TermEditor);
