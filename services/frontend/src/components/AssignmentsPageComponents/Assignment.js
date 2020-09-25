import React from 'react';

class Assignment extends React.Component {
    constructor(props) {
        super(props);
        //Setting up state components
        this.state = {
            class: props.class,
            name: props.name,
            desc: props.desc,
            day: props.day,
            color: props.color,
            id: props.id
        };
        //Binding methods
        this.editAssignment = this.editAssignment.bind(this);

    }

    //On login, if there is an access token, update state appropriately
    editAssignment(args) {
        this.setState(() => ({
            class: args.class,
            name: args.name,
            desc: args.desc,
            day: args.day,
            color: args.color,
            id: args.id
        }));

    }

    render() {
        return (
            <div>Assignment: {this.state.name}
                <div>Desc: {this.state.desc} </div>
                <div>Day: {this.state.day} </div>
                <button style={{backgroundColor: 'darkgreen'}}
                        onClick={/*this.editAssignment(get the info from the form state)*/}>Edit Assignment
                </button>
                <button style={{backgroundColor: 'red'}}
                        onClick={/*AssignmentDay.deleteAssignment(this.state.id)*/}>Delete Assignment
                </button>
            </div>
        );
    }
}

export default Assignment;


