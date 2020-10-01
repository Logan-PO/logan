import React from 'react';
import Container from '../containter';
import { Link } from 'gatsby';
import {  gotoAssignmentsForm, HomePageLocal } from '../../pages';
import { connect } from 'react-redux';
import { AssignmentDay } from './AssignmentDay';

export class AssignmentCatalog extends React.Component {
    assignmentDayList = [];
    constructor(props) {
        super(props);
        // this.assignmentDayList = props.assignmentDayList
    }
    addAssignment(assignmentObj) {
        let assignmentDay = new AssignmentDay();
        assignmentDay.day = assignmentObj.day;
        console.log('day val: ', assignmentDay.day);

        assignmentDay.addAssignment(assignmentObj);
        this.assignmentDayList.push(assignmentDay);
    }
    deleteAssignment(args) {//TODO: Check if assignmentDay exists?
        let assignmentDay = this.assignmentCatalog.find((ad) => ad.day === args.day);
        assignmentDay.deleteAssignment(args.id);
    }

    render() {
        function renderAssignmentDayList() {
            return assignmentCatalog.assignmentCatalog.assignmentDayList.map((assDay) => assDay.render());
        }

        let { assignmentCatalog } = this.props;
        console.log('Cat: ', assignmentCatalog.assignmentCatalog.assignmentDayList);
        return (
            <div>
                <Container>
                    <h1>Assignments</h1>
                    <div>
                        <Link to={HomePageLocal}>Back to Overview</Link>
                    </div>
                    {renderAssignmentDayList()}
                    <button style={{ backgroundColor: 'grey' }} onClick={() => gotoAssignmentsForm()}>
                        Add Assignment
                    </button>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    assignmentCatalog: state.AssignmentCatalog,
    formValues: state.form,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCatalog);
