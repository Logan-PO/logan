import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page } from '../shared';
import { fetchAssignments } from '../../store/assignments';
import styles from '../assignments/assignments-page.module.scss';
import OverviewAssignments from './overview-assignments';

export class OverviewPage extends React.Component {
    constructor(props) {
        super(props);
        this.didSelectAssignment = this.didSelectAssignment.bind(this);

        this.state = {
            selectedAid: undefined,
        };
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
            <Page title="Assignments">
                <div className={styles.assignmentsPage}>
                    <div className={styles.widenMargins}>This is where the Planner View Will Go</div>
                    <OverviewAssignments />
                </div>
            </Page>
        );
    }
}

OverviewPage.propTypes = {
    fetchAssignments: PropTypes.func,
    createAssignment: PropTypes.func,
    deleteAssignment: PropTypes.func,
};

const mapDispatchToProps = { fetchAssignments };

export default connect(null, mapDispatchToProps)(OverviewPage);
