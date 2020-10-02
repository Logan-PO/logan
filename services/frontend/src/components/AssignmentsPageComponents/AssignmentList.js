import React, { Component } from 'react';

export default class AssignmentList extends Component {
    render() {
        // eslint-disable-next-line react/prop-types
        const { assignmentDayList } = this.props;
        return <div>{assignmentDayList.map((assDay) => assDay.render())}</div>;
    }
}
