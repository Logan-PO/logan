import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Paper, List, Divider } from '@material-ui/core';
import { getRemindersSelectors, setShouldGoToReminder } from '../../store/reminders';
import ReminderCell from './reminder-cell';

class RemindersList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shouldGoToReminder: undefined,
        };
    }

    render() {
        return (
            <Paper variant="outlined" className="subtasks-list">
                <div className="basic-list">
                    <List>
                        {this.props.eid &&
                            this.props.rids.map((rid, index) => (
                                <React.Fragment key={rid}>
                                    <ReminderCell key={rid} rid={rid} />
                                    {index < this.props.rids.length - 1 && (
                                        <Divider component="li" style={{ marginTop: -1 }} />
                                    )}
                                </React.Fragment>
                            ))}
                    </List>
                </div>
            </Paper>
        );
    }
}

RemindersList.propTypes = {
    entity: PropTypes.object,
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
