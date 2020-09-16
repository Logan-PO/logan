import React from "react"

import Container from "../components/containter"
import { Link } from "gatsby"

export default function About() {
    return ( <Container>
            <h1>Assignments</h1>
    <p>Assignments go here</p>
            <div><Link to="../">Back to Overview</Link></div>
    </Container>
    )
}
