import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { dateUtils } from '@logan/core';
import { Grid, TextField } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import UpdateTimer from '../../utils/update-timer';
import {
    deleteAssignment,
    getAssignmentsSelectors,
    updateAssignment,
    updateAssignmentLocal,
} from '../../store/assignments';
import styles from './assignment-editor.module.scss';

const {
    dayjs,
    constants: { DB_DATE_FORMAT },
} = dateUtils;

//Represents a form to submit the info required to create a given assignment
class AssignmentEditor extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.updateTimer = new UpdateTimer(1000, () => this.props.updateAssignment(this.state.assignment));
        this.state = {
            assignment: undefined,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.aid !== prevProps.aid) {
            if (prevProps.aid && this.changesExist) {
                const prevAssignment = this.props.selectAssignment(prevProps.aid);

                if (prevAssignment) this.updateTimer.fire();

                this.updateTimer.stop();
            }

            this.setState({
                assignment: this.props.selectAssignment(this.props.aid),
            });
        } else {
            // Also if the task has been updated somewhere else, make sure the state reflects that
            const storeAssignment = this.props.selectAssignment(this.props.aid);
            if (!_.isEqual(storeAssignment, this.state.assignment)) {
                this.setState({ assignment: storeAssignment });
            }
        }
    }

    handleChange(prop, e) {
        this.changesExist = true;

        const changes = {};

        if (prop === 'dueDate') {
            changes[prop] = e.format(DB_DATE_FORMAT);
        } else {
            changes[prop] = e.target.value;
        }

        this.props.updateAssignmentLocal({
            id: this.props.aid,
            changes,
        });

        this.setState({
            assignment: _.merge({}, this.state.assignment, changes),
        });

        this.updateTimer.reset();
    }

    render() {
        return (
            <div className={styles.assignmentEditor}>
                <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Class"
                            fullWidth
                            onChange={this.handleChange.bind(this, 'cid')}
                            value={_.get(this.state.assignment, 'cid', '')}
                        />
                    </Grid>
                    <Grid item style={{ flexGrow: 1 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            onChange={this.handleChange.bind(this, 'title')}
                            value={_.get(this.state.assignment, 'title', '')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            onChange={this.handleChange.bind(this, 'description')}
                            value={_.get(this.state.assignment, 'description', '')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DatePicker
                            variant="inline"
                            value={dayjs(_.get(this.state.assignment, 'dueDate'))}
                            onChange={this.handleChange.bind(this, 'dueDate')}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
AssignmentEditor.propTypes = {
    aid: PropTypes.string,
    updateAssignmentLocal: PropTypes.func,
    selectAssignment: PropTypes.func,
    updateAssignment: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectAssignment: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateAssignment, updateAssignmentLocal, deleteAssignment };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentEditor);
