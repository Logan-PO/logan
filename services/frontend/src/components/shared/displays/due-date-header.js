import React from 'react';
import PropTypes from 'prop-types';
import { ListSubheader } from '@material-ui/core';
import { dateUtils } from '@logan/core';

class DueDateHeader extends React.Component {
    formattedDueDate() {
        if (this.props.dueDate === 'asap') {
            return 'ASAP';
        } else if (this.props.dueDate === 'eventually') {
            return 'Eventually';
        } else if (this.props.dueDate === 'overdue') {
            return 'Overdue';
        } else {
            const dueDate = dateUtils.toDate(this.props.dueDate);
            return dateUtils.humanReadableDate(dueDate);
        }
    }

    numDaysValue() {
        if (dateUtils.dueDateIsDate(this.props.dueDate)) {
            const days = dateUtils.toDate(this.props.dueDate).diff(dateUtils.dayjs().startOf('day'), 'days');
            if (days < 1) return '';
            else if (days === 1) return '1 day';
            else return `${days} days`;
        } else {
            return '';
        }
    }

    render() {
        return (
            <ListSubheader>
                {this.formattedDueDate()}
                <a style={{ float: 'right' }}>{this.numDaysValue()}</a>
            </ListSubheader>
        );
    }
}

DueDateHeader.propTypes = {
    dueDate: PropTypes.string,
};

export default DueDateHeader;
