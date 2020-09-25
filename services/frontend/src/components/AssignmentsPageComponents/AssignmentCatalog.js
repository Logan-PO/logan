import React from 'react';

class AssignmentCatalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentDayList: props.list
        }
    }

    addAssignment(args){
        let assignmentDay =  this.state.assignmentDayList.find(ad => ad.day === args.day)
        assignmentDay.addAssignment(args)
    }
    deleteAssignment(args){
        let assignmentDay =  this.state.assignmentDayList.find(ad => ad.day === args.day)
        assignmentDay.deleteAssignment(args.id)
    }
}

export default AssignmentCatalog
