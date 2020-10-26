import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { Page } from '../shared';
import { fetchAssignments } from '../../store/assignments';
import styles from '../assignments/assignments-page.module.scss';
import OverviewScheduleList from './overview-schedule-list';

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
            <Page title="Overview">
                <Grid container spacing={0} className={styles.assignmentsPage}>
                    <Grid item sm={6} md={4} lg={5} className={styles.listContainer}>
                        <OverviewScheduleList />
                    </Grid>
                </Grid>
            </Page>
        );
    }
}

OverviewPage.propTypes = {
    fetchAssignments: PropTypes.func,
};

const mapDispatchToProps = { fetchAssignments };

export default connect(null, mapDispatchToProps)(OverviewPage);
