import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper, List, Divider, ListItem, ListItemText, FormLabel, Fab } from '@material-ui/core';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import { getRemindersSelectors, setShouldGoToReminder } from '../../store/reminders';
import ReminderCell from './reminder-cell';
import classes from './reminders-list.module.scss';
import ReminderModal from './reminder-modal';

class RemindersList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shouldGoToReminder: undefined,
            reminderModalMode: 'create',
            reminderModalOpen: false,
        };
    }

    setReminderModalState(mode, open) {
        this.setState({
            reminderModalMode: mode,
            reminderModalOpen: open,
        });
    }

    listContent() {
        if (this.props.eid && this.props.rids.length) {
            return this.props.rids.map((rid, index) => (
                <React.Fragment key={rid}>
                    <ReminderCell key={rid} rid={rid} />
                    {index < this.props.rids.length - 1 && <Divider component="li" style={{ marginTop: -1 }} />}
                </React.Fragment>
            ));
        } else {
            return (
                <ListItem>
                    <ListItemText secondary="No reminders" />
                </ListItem>
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <FormLabel style={{ fontSize: '0.75rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                        Reminders
                    </FormLabel>
                    <Paper variant="outlined" className="subtasks-list" style={{ marginBottom: 0 }}>
                        <div className="basic-list">
                            <List>{this.listContent()}</List>
                        </div>
                    </Paper>
                    <div className={classes.fabContainer}>
                        <Fab
                            color="secondary"
                            size="small"
                            className={classes.fab}
                            onClick={this.setReminderModalState.bind(this, 'create', true)}
                        >
                            <AddAlertIcon fontSize="small" />
                        </Fab>
                    </div>
                    <ReminderModal
                        open={this.state.reminderModalOpen}
                        mode={this.state.reminderModalMode}
                        onClose={this.setReminderModalState.bind(this, 'create', false)}
                        entityType={this.props.entityType}
                        eid={this.props.eid}
                    />
                </div>
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
