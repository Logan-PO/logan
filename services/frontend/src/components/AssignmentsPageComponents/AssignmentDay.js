import React from 'react';
import {Assignment} from "./Assignment";

export class AssignmentDay extends React.Component {
    assignments = []
    day = ''
    constructor(props) {
        super(props);
        this.state = {

        };
        this.addAssignment = this.addAssignment.bind(this);
        this.deleteAssignment = this.deleteAssignment.bind(this);
    }

    addAssignment(assignmentObj) {
        this.assignments.push(assignmentObj)
    }

    deleteAssignment(id) {
        this.assignments.splice(this.assignments.indexOf(assignment => assignment.id === id),1)
    }

    render() {
        return (
        this.assignments.map((item) =>
            <li key={item.id}>
                <h3 style={{backgroundColor:item.color}}>{item.class} </h3>
                {item}
            </li>)
        );
    }
}
