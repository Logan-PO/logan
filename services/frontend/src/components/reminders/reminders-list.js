import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemindersIcon from '@material-ui/icons/Notifications';
import { getRemindersSelectors, setShouldGoToReminder } from '@logan/fe-shared/store/reminders';
import InputGroup from '../shared/controls/input-group';
import TextButton from '../shared/controls/text-button';
import '../shared/list.scss';
import ReminderCell from './reminder-cell';
import classes from './reminders-list.module.scss';
import ReminderModal from './reminder-modal';

class RemindersList extends React.Component {
    constructor(props) {
        super(props);

        this.shouldEditReminder = this.shouldEditReminder.bind(this);

        this.state = {
            shouldGoToReminder: undefined,
            reminderToEdit: undefined,
            reminderModalMode: 'create',
            reminderModalOpen: false,
        };
    }

    setReminderModalState(mode, open, rid) {
        this.setState({
            reminderModalMode: mode,
            reminderModalOpen: open,
            reminderToEdit: rid,
        });
    }

    shouldEditReminder(rid) {
        this.setReminderModalState('edit', true, rid);
    }

    render() {
        return (
            <React.Fragment>
                <InputGroup
                    classes={{ accessoryCell: this.props.rids.length && classes.accessoryCellAlignTop }}
                    icon={RemindersIcon}
                    label="Reminders"
                    content={
                        <div>
                            {this.props.eid && this.props.rids.length > 0 && (
                                <div className="small-list">
                                    {this.props.rids.map(rid => (
                                        <ReminderCell key={rid} rid={rid} onEdit={this.shouldEditReminder} />
                                    ))}
                                </div>
                            )}
                            <TextButton
                                classes={{ root: classes.addButton }}
                                IconComponent={AddIcon}
                                size="large"
                                onClick={this.setReminderModalState.bind(this, 'create', true, undefined)}
                            >
                                Add reminder
                            </TextButton>
                        </div>
                    }
                />
                <ReminderModal
                    open={this.state.reminderModalOpen}
                    mode={this.state.reminderModalMode}
                    rid={this.state.reminderToEdit}
                    onClose={this.setReminderModalState.bind(this, 'create', false, undefined)}
                    entityType={this.props.entityType}
                    eid={this.props.eid}
                />
            </React.Fragment>
        );
    }
}

RemindersList.propTypes = {
    entity: PropTypes.object,
    entityType: PropTypes.string,
    eid: PropTypes.string,
    rids: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
    const selectors = getRemindersSelectors(state.reminders);

    return {
        entity: selectors.selectById(ownProps.eid),
        rids: _.map(
            _.filter(selectors.selectAll(), reminder => reminder.eid === ownProps.eid),
            'rid'
        ),
    };
};

const mapDispatchToProps = {
    setShouldGoToReminder,
};

export default connect(mapStateToProps, mapDispatchToProps)(RemindersList);
