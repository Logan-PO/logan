import React from "react"

import Container from "../components/containter"

export default function assignmentDay({ assignmentsIn }){
    let assignments = assignmentsIn
   // assignments = assignments.map( (assignment) =>
    //    <li key={assignment.name}>{assignment.name} {assignment.desc}</li>
    //);
    return <Container><div><ul>{assignments}</ul></div></Container>
}
