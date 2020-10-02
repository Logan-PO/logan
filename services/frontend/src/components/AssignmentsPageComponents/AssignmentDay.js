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

    //Adds an assignment to this
    addAssignment(assignmentObj) {
        assignmentObj.setAssignmentDay(this)
        this.assignments.push(assignmentObj);
    }

    //Deletes specified assignment from this
    deleteAssignment(assignment) {
        console.log('del executed')
        const index = this.assignments.indexOf(assignment)
        this.assignments.splice( index, 1);
    }

    render() {
        console.log('AssDay Rend: ', this.assignments);
        //Map the assignments stored in this assignment day to their render functions and display it
        return (
                <div>
                    {this.assignments.map((assignment) => assignment.render())}
                </div>
        );
    } //TODO: Connect this with the assignmentReducers to allow delete functionality
}
