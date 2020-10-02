import React from 'react';
import Container from '../containter';
import { Link } from 'gatsby';
import { HomePageLocal} from '../../pages';
import { connect } from 'react-redux';
import { AssignmentDay } from './AssignmentDay';
import AssignmentForm from "./AssignmentForm";
import {addAssignment} from "./store";

export class AssignmentCatalog extends React.Component {
    assignmentDayList = [];
    constructor(props) {
        super(props);
        // this.assignmentDayList = props.assignmentDayList
    }

    //creates and assignmentday and adds the created assignment to it
    addAssignment(assignmentObj) {
        let assignmentDay = new AssignmentDay();
        assignmentDay.day = assignmentObj.day;
        console.log('day val: ', assignmentDay.day);

        assignmentDay.addAssignment(assignmentObj);
        this.assignmentDayList.push(assignmentDay);
    }
    //A method to delete a given assignment from this
    deleteAssignment(args) {//TODO: Check if assignmentDay exists?
        let assignmentDay = this.assignmentDayList.find((ad) => ad.day === args.day);
        assignmentDay.deleteAssignment(args);
    }

    render() {
        function renderAssignmentDayList() {
            return
        }

        //Taking the props mapped from the state for use
        let { assignmentCatalog,addAssignment,showForm,hideForm,isFormShown } = this.props;
        const submitForm = (formValues) => {
            addAssignment(formValues);
            console.log('submitting Form: ', formValues);
            hideForm()
        };

        console.log('Cat: ', assignmentCatalog.assignmentCatalog.assignmentDayList);
        return (
            <div>

                {isFormShown.shown ? (<AssignmentForm onSubmit = {submitForm}/>) : null}
                <Container>
                    <h1>Assignments</h1>
                    <div>
                        <Link to={HomePageLocal}>Back to Overview</Link>
                    </div>
                    {assignmentCatalog.assignmentCatalog.assignmentDayList.map((assDay) => assDay.render())}
                    <button style={{ backgroundColor: 'grey' }} onClick={showForm}>
                    Add Assignment
                </button>
                </Container>
            </div>
        );
    }
}

//Defining the props that the state will be mapped to for the render method
const mapStateToProps = (state) => ({
    assignmentCatalog: state.AssignmentCatalog,
    formValues: state.form,
    isFormShown: state.isFormShown,
});

//Defining the functions and what actions they will dispatch
const mapDispatchToProps = (dispatch) => {
    return {
        addAssignment: (assignment) => {
            dispatch({
                type: 'addAssignment',
                id: assignment.id,
                name: assignment.name,
                class: assignment.class,
                desc: assignment.desc,
                day: assignment.day,
                color: assignment.color,
            })
        },
        showForm: () => {
            dispatch( {
                type: 'showForm'
            })
        },
        hideForm: () => {
            dispatch( {
                type: 'hideForm',
            })
        },


    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCatalog);
