import React from 'react';

export class Assignment extends React.Component {
    class ;
    name;
    desc;
    day;
    color;
    id;
    constructor(props) {
        super(props);
        //Setting up state components

      this.updateFields(props)

        //Binding methods
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
    editAssignment(args){
        this.updateFields(args);
    }

    render() {
        console.log('Ass: ', this)
        return (

            <div>
                 <h1  style={{backgroundColor: this.color}}> {this.class} </h1>
                Assignment: {this.name}
                <div>Desc: {this.desc} </div>
                <div>Day: {this.day} </div>
                <button style={{backgroundColor: 'darkgreen'}}
                >Edit Assignment
                </button>
                <button style={{backgroundColor: 'red'}}
                >Delete Assignment
                </button>
            </div>
        );
    }
}

export default Assignment;


