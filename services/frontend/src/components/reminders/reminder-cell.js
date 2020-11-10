import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { dateUtils } from '@logan/core';
import { getRemindersSelectors, deleteReminder } from '../../store/reminders';

class ReminderCell extends React.Component {
    constructor(props) {
        super(props);

        this.deleteSelf = this.deleteSelf.bind(this);

        this.state = {
            reminder: undefined,
        };
    }

    componentDidMount() {
        this.updateCurrentReminder(this.props.getReminder(this.props.rid));
    }

    componentDidUpdate(prevProps) {
        if (this.props.rid !== prevProps.rid) {
            this.updateCurrentReminder(this.props.getReminder(this.props.rid));
        }
    }

    updateCurrentReminder(reminder) {
        this.setState({ reminder });
    }

    deleteSelf() {
        this.props.deleteReminder(this.state.reminder);
    }

    render() {
        const ts = _.get(this.state.reminder, 'timestamp');
        const dateObject = dateUtils.toDateTime(ts);
        const timeString = `${dateUtils.humanReadableDate(dateObject)} at ${dateUtils.formatAsTime(dateObject)}`;

        return (
            <div className="list-cell">
                <ListItem dense>
                    <ListItemIcon>
                        <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText primary={_.get(this.state.reminder, 'message', '')} secondary={timeString} />
                    <ListItemSecondaryAction className="actions">
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={this.deleteSelf}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </div>
        );
    }
}

ReminderCell.propTypes = {
    rid: PropTypes.string,
    getReminder: PropTypes.func,
    deleteReminder: PropTypes.func,
};

const mapStateToProps = state => ({
    getReminder: getRemindersSelectors(state.reminders).selectById,
});

const mapDispatchToProps = {
    deleteReminder,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReminderCell);
