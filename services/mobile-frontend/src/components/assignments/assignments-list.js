import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SectionList, View } from 'react-native';
import { List, FAB, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import { getAssignmentsSelectors, deleteAssignment, deleteAssignmentLocal } from '@logan/fe-shared/store/assignments';
import { getSections } from '@logan/fe-shared/sorting/assignments';
import { dateUtils } from '@logan/core';
import SegmentedControl from '@react-native-community/segmented-control';
import AssignmentCell from '../../components/assignments/assignment-cell';
import ViewController from '../shared/view-controller';
import { typographyStyles } from '../shared/typography';
import theme from '../../globals/theme';

class AssignmentsList extends React.Component {
    constructor(props) {
        super(props);

        this._shouldShowAssignment = this._shouldShowAssignment.bind(this);
        this.openAssignment = this.openAssignment.bind(this);
        this.openDeleteConfirmation = this.openDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
        this.confirmDeletion = this.confirmDeletion.bind(this);

        this.state = {
            assignmentToDelete: undefined,
            showingPastAssignments: false,
        };
    }

    _shouldShowAssignment(assignment) {
        const today = dateUtils.dayjs();

        if (this.state.showingPastAssignments) {
            return dateUtils.dayjs(assignment.dueDate).isBefore(today, 'day');
        } else {
            return dateUtils.dayjs(assignment.dueDate).isSameOrAfter(today, 'day');
        }
    }

    openAssignment(aid) {
        this.props.navigation.push('Assignment', { aid });
    }

    openDeleteConfirmation(assignmentToDelete, callbacks) {
        this.setState({
            assignmentToDelete,
            deleteConfirmationCallbacks: callbacks,
        });
    }

    hideDeleteConfirmation() {
        this.state.deleteConfirmationCallbacks.deny();
        this.setState({ assignmentToDelete: undefined, deleteConfirmationCallbacks: undefined });
    }

    async confirmDeletion() {
        const callback = this.state.deleteConfirmationCallbacks.confirm;
        const assignmentToDelete = this.state.assignmentToDelete;
        this.setState({ assignmentToDelete: undefined, deleteConfirmationCallbacks: undefined });
        await callback();
        this.props.deleteAssignment(assignmentToDelete);
    }

    render() {
        const assignments = _.filter(this.props.assignments, assignment => this._shouldShowAssignment(assignment));
        const sections = getSections(assignments, this.state.showingPastAssignments); //TODO: Move _should to fe-shared
        const listData = sections.map(([name, aids]) => ({ title: name, data: aids }));

        return (
            <ViewController
                title="Assignments"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActionIsFetch={true}
            >
                <View
                    style={{
                        padding: 12,
                        paddingTop: 0,
                        backgroundColor: theme.colors.primary,
                    }}
                >
                    <SegmentedControl
                        values={['Upcoming', 'Past']}
                        selectedIndex={this.state.showingPastAssignments ? 1 : 0}
                        onChange={event =>
                            this.setState({ showingPastAssignments: !!event.nativeEvent.selectedSegmentIndex })
                        }
                        tintColor="white"
                    />
                </View>
                <SectionList
                    style={{ height: '100%', backgroundColor: 'white' }}
                    sections={listData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <AssignmentCell
                            key={item}
                            aid={item}
                            onPress={() => this.openAssignment(item)}
                            onDeletePressed={this.openDeleteConfirmation}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <List.Subheader style={{ backgroundColor: 'white' }} key={title}>
                            {title}
                        </List.Subheader>
                    )}
                />
                <FAB
                    icon="plus"
                    color="white"
                    style={{
                        position: 'absolute',
                        margin: 16,
                        bottom: 0,
                        right: 0,
                    }}
                    onPress={() => this.props.navigation.navigate('New Assignment')}
                />
                <Portal>
                    <Dialog visible={!!this.state.assignmentToDelete} onDismiss={this.hideDeleteConfirmation}>
                        <Dialog.Title>Are you sure?</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>{`You're about to delete an assignment.\nThis can't be undone.`}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.hideDeleteConfirmation} labelStyle={typographyStyles.button}>
                                Cancel
                            </Button>
                            <Button onPress={this.confirmDeletion} color="red" labelStyle={typographyStyles.button}>
                                Delete
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ViewController>
        );
    }
}

AssignmentsList.propTypes = {
    assignments: PropTypes.array,
    fetchAssignments: PropTypes.func,
    navigation: PropTypes.object,
    route: PropTypes.object,
    deleteAssignment: PropTypes.func,
};

const mapStateToProps = state => ({
    assignments: getAssignmentsSelectors(state.assignments).selectAll(),
});

export default connect(mapStateToProps, { deleteAssignment, deleteAssignmentLocal })(AssignmentsList);
