import React from "react"
import "../styles/global.css"
import { Link } from "gatsby"
import Container from "../components/containter"
import configureStore from "../components/fieldForm/store";

export const store = configureStore();

store.subscribe( () => console.log(store.getState()))



export default function Home() {
    return(
            <Container>
                <Container>
                    <h1>Overview Page (WIP)</h1><Link to="/assignments/">Assignments</Link>
                </Container>
            </Container>
    )
}
