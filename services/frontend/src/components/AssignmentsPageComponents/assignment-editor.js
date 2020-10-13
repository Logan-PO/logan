import React, { Component } from 'react';
import UpdateTimer from '../../utils/update-timer';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import styles from './assignment-editor.module.scss';
import {
    deleteAssignment,
    getAssignmentsSelectors,
    updateAssignment,
    updateAssignmentLocal,
} from '../../store/assignments';

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
            if (prevProps.aid) {
                this.updateTimer.fire();
                this.updateTimer.stop();
            }

            this.setState({
                assignment: this.props.selectAssignment(this.props.aid),
            });
        }
    }

    handleChange(prop, e) {
        const changes = {};

        changes[prop] = e.target.value;

        this.props.updateAssignmentLocal({
            id: this.props.aid,
            changes,
        });

        this.setState({
            assignment: _.merge({}, this.state.assignment, changes),
        });

        this.updateTimer.reset();
    }
    /*render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Field name="class" component={field} type="text" placeholder="class" />
                <Field name="name" component={field} type="text" placeholder="name" />
                <Field name="desc" component={field} type="text" placeholder="desc" />
                <Field name="day" component={field} type="text" placeholder="day" />
                <Field name="color" component={field} type="text" placeholder="color" />
                <Field name="id" component={field} type="text" placeholder="id" />
                <button type="submit" label="submit">
                    Submit
                </button>
            </form>
        );
    }*/
    render() {
        const assignment = this.props.selectAssignment(this.props.aid);

        return (
            <div className={styles.assignmentEditor}>
                <div className={styles.row}>
                    <div className={styles.cell}>
                        <input
                            type="text"
                            className={styles.titleInput}
                            onChange={this.handleChange.bind(this, 'class')}
                            value={_.get(assignment, 'class', '')}
                        />
                        <input
                            type="text"
                            className={styles.titleInput}
                            onChange={this.handleChange.bind(this, 'name')}
                            value={_.get(assignment, 'name', '')}
                        />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.cell}>
                        <textarea
                            className={styles.descriptionInput}
                            onChange={this.handleChange.bind(this, 'desc')}
                            value={_.get(assignment, 'desc', '')}
                        />
                        <div className={styles.cell}>
                            <textarea
                                className={styles.descriptionInput}
                                onChange={this.handleChange.bind(this, 'day')}
                                value={_.get(assignment, 'day', '')}
                            />
                            <div className={styles.cell}>
                                <textarea
                                    className={styles.descriptionInput}
                                    onChange={this.handleChange.bind(this, 'color')}
                                    value={_.get(assignment, 'color', '')}
                                />
                                <div className={styles.cell}>
                                    <textarea
                                        className={styles.descriptionInput}
                                        onChange={this.handleChange.bind(this, 'id')}
                                        value={_.get(assignment, 'id', '')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
