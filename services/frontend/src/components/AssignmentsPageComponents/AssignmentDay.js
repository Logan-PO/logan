import React from 'react';
import {Assignment} from "./Assignment";

export class AssignmentDay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
            day: ''
        };
        this.addAssignment = this.addAssignment.bind(this);
        this.deleteAssignment = this.deleteAssignment.bind(this);
    }

    addAssignment(args) {
        this.props.assignments.push(new Assignment(args))
    }

    deleteAssignment(id) {
        this.props.assignments.splice(this.props.assignments.indexOf(assignment => assignment.id === id),1)
    }

    render() {
        return (
        this.props.assignments.map((item) =>
            <li key={item.id}>
                <h3 style={{backgroundColor:item.color}}>{item.class} </h3>
                {item}
            </li>)
        );
    }
}
