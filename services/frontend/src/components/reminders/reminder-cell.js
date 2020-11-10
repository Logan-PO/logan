import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRemindersSelectors } from '../../store/reminders';

class ReminderCell extends React.Component {
    constructor(props) {
        super(props);

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

    render() {
        return <div>{_.get(this.state.reminder, 'message')}</div>;
    }
}

ReminderCell.propTypes = {
    rid: PropTypes.string,
    getReminder: PropTypes.func,
};

const mapStateToProps = state => ({
    getReminder: getRemindersSelectors(state.reminders).selectById,
});

export default connect(mapStateToProps, null)(ReminderCell);
