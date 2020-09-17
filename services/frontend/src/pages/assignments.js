import React from "react"

import Container from "../components/containter"
import assignmentDay from "../components/assignment-day"

import { Link } from "gatsby"

export default function About() {
    const ass = <assignment name="Test" desc={"test Test"}>ok</assignment>;
    const assignments1 = <assignmentIn day="Tues" assignments ={ass}>ok</assignmentIn>
    return ( <Container>
            <h1>Assignments</h1>
    <p>
        {assignmentDay(assignments1)}
    </p>
            <div><Link to="../">Back to Overview</Link></div>
    </Container>
    )
}
