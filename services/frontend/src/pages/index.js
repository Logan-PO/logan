import React from "react"
import "../styles/global.css"
import { Link } from "gatsby"
import Container from "../components/containter"


export default function Home() {
  return <Container>
    <h1>Overview Page (WIP)</h1><Link to="/assignments/">Assignments</Link>
  </Container>
}
