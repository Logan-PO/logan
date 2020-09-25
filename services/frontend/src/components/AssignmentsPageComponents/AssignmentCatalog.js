import React from 'react';
import Container from "../containter";
import {Link} from "gatsby";
import {AssignmentFormLocal, gotoAssignmentsForm, HomePageLocal} from "../../pages";
import {addAssignment, deleteAssignment} from "./store";
import { connect } from 'react-redux';

class AssignmentCatalog extends React.Component {

    addAssignment(args){
        let assignmentDay =  this.state.assignmentCatalog.find(ad => ad.day === args.day)
        assignmentDay.addAssignment(args)
    }
    deleteAssignment(args){
        let assignmentDay =  this.state.assignmentCatalog.find(ad => ad.day === args.day)
        assignmentDay.deleteAssignment(args.id)
    }

    render() {
        let { assignmentCatalog, addAssignment, deleteAssignment } = this.props;
       return ( <div>
            <Container>
                <h1>Assignments</h1>
                <div><Link to= {HomePageLocal}>Back to Overview</Link></div>
                {assignmentCatalog}
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
    assignmentCatalog: state.assignmentCatalog,
});

const mapDispatchToProps = {
    addAssignment,
    deleteAssignment,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCatalog);
