import React from "react"
import "../styles/global.css"
import { Link,navigate } from "gatsby"
import Container from "../components/containter"
import configureStore from "../components/store";

export const store = configureStore();

store.subscribe( () => console.log(store.getState()))

export const gotoAssignments = () => {
    navigate('/Assignments/')
}

export const gotoAssignmentsForm = () => {
    navigate('/AssignmentForm/')
}

export const AssignmentsPageLocal = '/Assignments/'
export const HomePageLocal = '../'
export const AssignmentFormLocal = '/AssignmentForm'

export default function Home() {
    return(
            <Container>
                <Container>
                    <h1>Overview Page (WIP)</h1><Link to={AssignmentsPageLocal}>Assignments</Link>
                </Container>
            </Container>
    )
}
