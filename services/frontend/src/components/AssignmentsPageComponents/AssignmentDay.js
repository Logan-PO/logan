import React from 'react';

class Assignment extends React.Component {
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
        this.state.assignments.push(new Assignment(args))
    }

    deleteAssignment(id) {
        this.state.assignments.splice(this.state.assignments.indexOf(assignment => assignment.id === id),1)
    }

    render() {
        return (
        this.state.assignments.map((item) =>
            <li key={item.id}>
                <h3 style={{backgroundColor:item.color}}>{item.class} </h3>
                {item}
            </li>)
        );
    }
}
