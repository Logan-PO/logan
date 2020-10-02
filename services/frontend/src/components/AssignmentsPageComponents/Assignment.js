import React from 'react';
import { connect } from 'react-redux';
import {deleteAssignment, editAssignment} from './store';


export class Assignment extends React.Component {
    class;
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
    setAssignmentDay(assignmentDay){
        this.assignmentDay = assignmentDay

    }

    //On login, if there is an access token, update state appropriately
    updateFields(args) {
        this.class = args.class;
        this.name = args.name;
        this.desc = args.desc;
        this.day = args.day;
        this.color = args.color;
        this.id = args.id;
    }
    editAssignment(args) {
        this.updateFields(args);
    }
    deleteAssignment() {
        this.assignmentDay.deleteAssignment(this)
        console.log('Del Called')
    }

    render() {
        console.log('Ass: ', this);

        const submitEditForm = (formValues) => {
            editAssignment(this,formValues);
            console.log('submitting Form: ', formValues);
            //hideEditForm()
        };

        let {} = this.props
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

//TODO: Connect this with the store to allow edit  functionality

