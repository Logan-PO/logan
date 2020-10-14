import React from 'react';
import '../styles/global.css';
import { Link, navigate } from 'gatsby';
import Container from '../components/containter';

export const gotoAssignments = () => {
    navigate('/assignments/');
};

export const AssignmentsPageLocal = '/assignments/';
export const HomePageLocal = '../';
export const TasksPageLocal = '/tasks/';

export default function Home() {
    return (
        <Container>
            <h1>Overview Page (WIP)</h1>
            <div>
                <Link to={AssignmentsPageLocal}>Assignments</Link>
                <div>
                    <Link to={TasksPageLocal}>Tasks</Link>
                </div>
            </div>
        </Container>
    );
}
