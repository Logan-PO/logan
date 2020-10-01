import React from 'react';
import Container from "../containter";
import {Link} from "gatsby";
import {AssignmentFormLocal, gotoAssignmentsForm, HomePageLocal} from "../../pages";
import {addAssignment, deleteAssignment} from "./store";
import {connect} from 'react-redux';
import {AssignmentDay} from "./AssignmentDay";

export class AssignmentCatalog extends React.Component {
    assignmentDayList = [];
    constructor(props) {
        super(props);
       // this.assignmentDayList = props.assignmentDayList
    }
    addAssignment(assignmentObj){
        let assignmentDay =
            new AssignmentDay()
        assignmentDay.day = assignmentObj.day
        console.log('day val: ', assignmentDay.day);

        assignmentDay.addAssignment(assignmentObj)
        this.assignmentDayList.push(assignmentDay)
    }
    deleteAssignment(args){
        let assignmentDay =  this.props.assignmentCatalog.find(ad => ad.day === args.day)
        assignmentDay.deleteAssignment(args.id)
    }

    render() {

        function renderAssignmentDayList(){
           return  assignmentCatalog.assignmentCatalog.assignmentDayList.map( (assDay) =>
            assDay.render()
            )
        }

        let { assignmentCatalog } = this.props;
        console.log('Cat: ', assignmentCatalog.assignmentCatalog.assignmentDayList);
       return ( <div>
            <Container>
                <h1>Assignments</h1>
                <div><Link to= {HomePageLocal}>Back to Overview</Link></div>
                {renderAssignmentDayList()}
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
