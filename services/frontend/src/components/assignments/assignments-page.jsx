import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Page } from '../shared';
import EmptySticker from '../shared/displays/empty-sticker';
import AssignmentsList from './assignments-list';
import AssignmentEditor from './assignment-editor';
import styles from './assignments-page.module.scss';
import { fetchAssignments } from 'packages/fe-shared/store/assignments';

class AssignmentsPage extends React.Component {
    constructor(props) {
        super(props);
        this.didSelectAssignment = this.didSelectAssignment.bind(this);

        this.state = {
            selectedAid: undefined,
        };
    }

    didSelectAssignment(aid) {
        console.log(aid);
        console.trace();
        this.setState({ selectedAid: aid });
    }

    render() {
        return (
            <Page title="Assignments">
                <div className={styles.assignmentsPage}>
                    <div className={styles.listContainer}>
                        <AssignmentsList onAssignmentSelected={this.didSelectAssignment} />
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.editorContainer}>
                        {this.state.selectedAid ? (
                            <AssignmentEditor aid={this.state.selectedAid} />
                        ) : (
                            <EmptySticker message="Nothing selected" />
                        )}
                    </div>
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
