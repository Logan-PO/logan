import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { dateUtils } from 'packages/core';
import { getRemindersSelectors, deleteReminder } from 'packages/fe-shared/store/reminders';
import BreadcrumbsLike from '../shared/breadcrumbs-like';
import '../shared/list.scss';
import styles from './reminder-cell.module.scss';

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

    componentDidUpdate() {
        const storedReminder = this.props.getReminder(this.props.rid);

        if (!_.isEqual(storedReminder, this.state.reminder)) {
            this.updateCurrentReminder(storedReminder);
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
        const timeString = `${dateUtils.humanReadableDate(dateObject)} @ ${dateObject.format('h:mma')}`;

        return (
            <div className={`list-item ${styles.reminderCell}`}>
                <BreadcrumbsLike
                    colors={['textPrimary', 'textSecondary']}
                    sections={[_.get(this.state.reminder, 'message', ''), timeString]}
                />
                <div className="actions">
                    <IconButton className="action" size="small" onClick={() => this.props.onEdit(this.props.rid)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton className="action" size="small" onClick={this.deleteSelf}>
                        <DeleteIcon fontSize="inherit" color="error" />
                    </IconButton>
                </div>
            </div>
        );
    }
}

ReminderCell.propTypes = {
    rid: PropTypes.string,
    getReminder: PropTypes.func,
    deleteReminder: PropTypes.func,
    onEdit: PropTypes.func,
};

const mapStateToProps = state => ({
    getReminder: getRemindersSelectors(state.reminders).selectById,
});

const mapDispatchToProps = {
    deleteReminder,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReminderCell);
