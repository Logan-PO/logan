import React from 'react';

export class AssignmentDay extends React.Component {
    assignments = [];
    day = '';
    constructor(props) {
        super(props);
        this.state = {};
        this.addAssignment = this.addAssignment.bind(this);
        this.deleteAssignment = this.deleteAssignment.bind(this);
    }

    addAssignment(assignmentObj) {
        this.assignments.push(assignmentObj);
    }

    deleteAssignment(id) {
        this.assignments.splice(
            this.assignments.indexOf((assignment) => assignment.id === id),
            1
        );
    }

    render() {
        console.log('AssDay Rend: ', this.assignments);

        return <div>{this.assignments.map((assignment) => assignment.render())}</div>;
    } //TODO: Connect this with the store to allow delete functionality
}
