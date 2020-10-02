import React from 'react';
import '../styles/global.css';
import { Link, navigate } from 'gatsby';
import Container from '../components/containter';

export const gotoAssignments = () => {
    navigate('/assignments/');
};

export const AssignmentsPageLocal = '/assignments/';
export const HomePageLocal = '../';

export default function Home() {
    return (
        <Container>
            <Container>
                <h1>Overview Page (WIP)</h1>
                <Link to={AssignmentsPageLocal}>Assignments</Link>
            </Container>
        </Container>
    );
}
