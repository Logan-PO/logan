import React from "react"
import classColors from "../styles/assignments.css"
import { Link } from "gatsby"
import Container from "../components/containter"


let assignmentsList = [
    {id: 35, name: 'Lab', color: 'red', class: 'PHSY 101', desc: "sad"},
    {id: 42, name: 'Project', color: 'blue', class: 'EECS 293', desc: "happy"},
    {id: 71, name: 'Grading', color: 'green', class: 'all', desc: "?"},
]




export default function DisplayAssignments() {

    let items = assignmentsList.map((item) =>
        <li key={item.id}>
            <h3 style={{backgroundColor:item.color}}>{item.class}</h3>
            <div>Assignment: {item.name} <div>Desc: {item.desc}</div> </div>
        </li>
    );

    return ( <div><Container>
            <h1>Assignments</h1>

        <ul>{items}</ul>

            <div><Link to="../">Back to Overview</Link></div>
    </Container> <button style={{backgroundColor:'grey'}} onClick={AddAssignment()}>Add Assignment</button> </div>
    )
}
