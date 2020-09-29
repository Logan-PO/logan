import React from 'react';
import Container from "../containter";
import {Link} from "gatsby";
import {AssignmentFormLocal, gotoAssignmentsForm, HomePageLocal} from "../../pages";
import {addAssignment, deleteAssignment} from "./store";
import {connect} from 'react-redux';
import {AssignmentDay} from "./AssignmentDay";

export class AssignmentCatalog extends React.Component {
    assignmentDayList ;
    constructor(props) {
        super(props);
        this.assignmentDayList = props.assignmentDayList
    }
    addAssignment(args){
        let assignmentDay =
            new AssignmentDay({assignments: [],day: args.day})

        assignmentDay.addAssignment(args)
        this.assignmentDayList.push(assignmentDay)
    }
    deleteAssignment(args){
        let assignmentDay =  this.props.assignmentCatalog.find(ad => ad.day === args.day)
        assignmentDay.deleteAssignment(args.id)
    }

    render() {

        let { assignmentCatalog, addAssignment, deleteAssignment , formValues} = this.props;
       return ( <div>
            <Container>
                <h1>Assignments</h1>
                <div><Link to= {HomePageLocal}>Back to Overview</Link></div>
                {assignmentCatalog.assignmentDayList}
                <button style={{backgroundColor:'grey'}} onClick={() => gotoAssignmentsForm()}>
                    Add Assignment
                </button>
            </Container>
            <div><Link to={AssignmentFormLocal}>Form</Link></div>
        </div>
       );
    }
}

const mapStateToProps = (state) => ({
    assignmentCatalog: state.AssignmentCatalog,
    formValues: state.form
});

const mapDispatchToProps = {
    addAssignment,
    deleteAssignment,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCatalog);
