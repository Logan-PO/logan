import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Button, Dialog, List, Paragraph, Portal } from 'react-native-paper';
import { getRemindersSelectors, deleteReminder } from '@logan/fe-shared/store/reminders';
import ListItem from '../shared/list-item';
import Typography, { typographyStyles } from '../shared/typography';
import ReminderCell from './reminder-cell';

class RemindersList extends React.Component {
    constructor(props) {
        super(props);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.state = {
            modalShown: false,
        };
    }

    openModal({ message, confirm }) {
        this.setState({
            modalShown: true,
            modalMessage: message,
            modalConfirmation: () => {
                confirm && confirm();
                this.closeModal();
            },
        });
    }

    closeModal() {
        this.setState({
            modalShown: false,
            modalMessage: undefined,
            modalConfirmation: undefined,
        });
    }

    render() {
        return (
            <React.Fragment>
                <List.Subheader>{this.props.title || 'Reminders'}</List.Subheader>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    {this.props.reminders.length ? (
                        this.props.reminders.map(reminder => (
                            <ReminderCell
                                key={reminder.rid}
                                reminder={reminder}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'Edit Reminder',
                                        _.pick(reminder, ['rid', 'eid', 'entityType'])
                                    )
                                }
                                onDeletePressed={() =>
                                    this.openModal({
                                        message: 'You are about to delete a reminder.\nThis cannot be undone.',
                                        confirm: () => this.props.deleteReminder(reminder),
                                    })
                                }
                            />
                        ))
                    ) : (
                        <ListItem
                            leftContent={
                                <Typography color="secondary" style={{ fontStyle: 'italic' }}>
                                    None
                                </Typography>
                            }
                        />
                    )}
                </View>
                <Portal>
                    <Dialog visible={this.state.modalShown} onDismiss={this.closeModal}>
                        <Dialog.Title>Are you sure?</Dialog.Title>
                        <Dialog.Content>
                            {_.get(this.state, 'modalMessage', '')
                                .split('\n')
                                .map((line, i) => (
                                    <Paragraph key={i}>{line}</Paragraph>
                                ))}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.closeModal} labelStyle={typographyStyles.button}>
                                Cancel
                            </Button>
                            <Button
                                onPress={this.state.modalConfirmation}
                                color="red"
                                labelStyle={typographyStyles.button}
                            >
                                Delete
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </React.Fragment>
        );
    }
}

RemindersList.propTypes = {
    title: PropTypes.string,
    eid: PropTypes.string,
    reminders: PropTypes.array,
    route: PropTypes.object,
    navigation: PropTypes.object,
    deleteReminder: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
    reminders: _.filter(getRemindersSelectors(state.reminders).selectAll(), reminder => reminder.eid === ownProps.eid),
});

const mapDispatchToProps = {
    deleteReminder,
};

export default connect(mapStateToProps, mapDispatchToProps)(RemindersList);
