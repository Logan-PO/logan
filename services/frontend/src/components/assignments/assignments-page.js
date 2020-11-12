import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { fetchAssignments } from '@logan/fe-shared/store/assignments';
import { Page } from '../shared';
import EmptySticker from '../shared/displays/empty-sticker';
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

    didSelectAssignment(aid) {
        this.setState({ selectedAid: aid });
    }

    render() {
        return (
            <Page title="Assignments">
                <Grid container spacing={0} className={styles.assignmentsPage}>
                    <Grid item sm={6} md={4} lg={5} className={styles.listContainer}>
                        <AssignmentsList onAssignmentSelected={this.didSelectAssignment} />
                    </Grid>
                    <Grid item sm={6} md={8} lg={7} className={styles.editorContainer}>
                        {this.state.selectedAid ? (
                            <AssignmentEditor aid={this.state.selectedAid} />
                        ) : (
                            <EmptySticker message="Nothing selected" />
                        )}
                    </Grid>
                </Grid>
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
