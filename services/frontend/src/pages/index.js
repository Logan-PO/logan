import React from "react"
import "../styles/global.css"
import { Link } from "gatsby"
import Container from "../components/containter"
import {createStore} from "redux";
import rootReducer from "../components/rootReducer";

export const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

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
