import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page } from '../shared';
import { fetchAssignments } from '../../store/assignments';
import api from '../../utils/api';
import AssignmentsList from './assignments-list';
import AssignmentEditor from './assignment-editor';
import styles from './assignments-page.module.scss';

export class AssignmentsPage extends React.Component {
    constructor(props) {
        super(props);
        this.didSelectAssignment = this.didSelectAssignment.bind(this);

        this.state = {
            selectedAid: undefined,
        };
    }

    componentDidMount() {
        api.setBearerToken(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJmYWJiMDQyZi05NjU2LTRjMjAtYmYzMy1hZmM5MDMzN2E1ZTEiLCJpYXQiOjE2MDE4NDM3OTB9.oaMx3ATdIOYikkdMPI4f8lnAIcS0z5hAaP6hODOQUC8'
        );
        this.props.fetchAssignments();
    }

    didSelectAssignment(aid) {
        this.setState({ selectedAid: aid });
    }
    render() {
        //possible source of error here
        return (
            <Page title="Assignments">
                <div className={styles.assignmentsPage}>
                    <div className={styles.widenMargins}>
                        <AssignmentsList onAssignmentSelected={this.didSelectAssignment} />
                    </div>
                    <AssignmentEditor aid={this.state.selectedAid} />
                </div>
            </Page>
        );
    }
}

AssignmentsPage.propTypes = {
    fetchAssignments: PropTypes.func,
    createAssignment: PropTypes.func,
    deleteAssignment: PropTypes.func,
};

const mapDispatchToProps = { fetchAssignments };

export default connect(null, mapDispatchToProps)(AssignmentsPage);
