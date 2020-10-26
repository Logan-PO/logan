import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader } from '@material-ui/core';
import { fetchAssignments, getAssignmentsSelectors, compareDueDates } from '../../store/assignments';
import OverviewAssignmentCell from './overview-assignment-cell';
import '../shared/list.scss';

class OverviewAssignments extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="scrollable-list">
                <div className="scroll-view">
                    <List>
                        {this.props.sections.map(section => {
                            const [dueDate, aids] = section;
                            return (
                                <React.Fragment key={section[0]}>
                                    <ListSubheader>{dueDate}</ListSubheader>
                                    {aids.map(aid => (
                                        <OverviewAssignmentCell key={aid} aid={aid} />
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </List>
                </div>
            </div>
        );
    }
}
OverviewAssignments.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.array),
    fetchAssignments: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getAssignmentsSelectors(state.assignments);
    const sections = {};
    for (const assignment of selectors.selectAll()) {
        if (sections[assignment.dueDate]) sections[assignment.dueDate].push(assignment.aid);
        else sections[assignment.dueDate] = [assignment.aid];
    }

    return {
        sections: Object.entries(sections).sort((a, b) => compareDueDates(a[0], b[0])),
    };
};

const mapDispatchToProps = { fetchAssignments };

export default connect(mapStateToProps, mapDispatchToProps)(OverviewAssignments);
