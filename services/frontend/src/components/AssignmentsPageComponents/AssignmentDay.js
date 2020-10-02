import React from 'react';
import {store} from "./store";
import { Provider } from 'react-redux';

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
        assignmentObj.setAssignmentDay(this)
        this.assignments.push(assignmentObj);
    }

    deleteAssignment(assignment) {
        console.log('del executed')
        const index = this.assignments.indexOf(assignment)
        this.assignments.splice( index, 1);
    }

    render() {
        console.log('AssDay Rend: ', this.assignments);

        return (
            <Provider store={store}>
                <div>
                    {this.assignments.map((assignment) => assignment.render())}
                </div>
            </Provider>
        );
    } //TODO: Connect this with the store to allow delete functionality
}
