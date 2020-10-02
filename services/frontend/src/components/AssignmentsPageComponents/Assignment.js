import React from 'react';
import { connect } from 'react-redux';
import {deleteAssignment, editAssignment} from './AssignmentReducers';


export class Assignment extends React.Component {
    class;//Naming the base properties of an assignment
    name;
    desc;
    day;
    color;
    id;
    assignmentDay;
    constructor(props) {
        super(props);
        //Setting up state components

        this.updateFields(props);

        //Binding methods
        this.deleteAssignment = this.deleteAssignment.bind(this)
    }
    //A method to set the assignmentDay of this assignment
    setAssignmentDay(assignmentDay){
        this.assignmentDay = assignmentDay

    }

    //Updates the fields of this assignment
    updateFields(args) {
        this.class = args.class;
        this.name = args.name;
        this.desc = args.desc;
        this.day = args.day;
        this.color = args.color;
        this.id = args.id;
    }
    //Edit's the fields of the current assignment
    editAssignment(args) {
        this.updateFields(args);
    }
    //Deletes this assignment from its assignmentday
    deleteAssignment() {
        this.assignmentDay.deleteAssignment(this)
        console.log('Del Called')
    }

    render() {
        console.log('Ass: ', this);

        //TODO: placeholder for fully implemented edit form
        const submitEditForm = (formValues) => {
            editAssignment(this,formValues);
            console.log('submitting Form: ', formValues);
            //hideEditForm()
        };

        return (

                <div>

                    <h1 style={{ backgroundColor: this.color }}> {this.class} </h1>
                    Assignment: {this.name}
                    <div>Desc: {this.desc} </div>
                    <div>Day: {this.day} </div>
                    <button style={{ backgroundColor: 'darkgreen' }} >
                        Edit Assignment
                    </button>
                    <button style={{ backgroundColor: 'red' }} onClick={this.deleteAssignment} >
                        Delete Assignment
                    </button>
                </div>
        );
    }
}

//TODO: Connect this with the assignmentReducers to allow edit  functionality

