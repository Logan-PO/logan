import React from 'react';
import AssignmentsList from './assignments-list';
import AssignmentEditor from './assignment-editor';
import { connect } from 'react-redux';
import styles from './assignments-page.module.scss';
import { fetchAssignments } from '../../store/assignments';
import PropTypes from 'prop-types';

export class AssignmentsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedAid: undefined,
        };
        this.didSelectAssignment = this.didSelectAssignment.bind(this);
    }

    componentDidMount() {
        this.props.fetchAssignments();
    }

    didSelectAssignment(aid) {
        this.setState({ selectedAid: aid });
    }
    render() {
        //possible source of error here
        return (
            <div className={styles.page}>
                <div className={styles.navbar}>
                    <h2>Logan / Assignments</h2>
                </div>
                <div className={styles.assignmentsPage}>
                    <div className={styles.sidebar}></div>
                    <AssignmentsList onAssignmentSelected={this.didSelectAssignment} />
                    <AssignmentEditor aid={this.state.selectedAid} />
                </div>
            </div>
        );
    }
}

AssignmentsPage.propTypes = {
    fetchAssignments: PropTypes.func,
    createAssignment: PropTypes.func,
    deleteAssignment: PropTypes.func,
};

const mapDispatchToProps = { fetchAssignments };

export default connect(null, mapDispatchToProps)(fetchAssignments);
