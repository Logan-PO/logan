import React from 'react';
import { Link } from 'gatsby';

export default function Home() {
    return (
        <div>
            <div>Hello world!</div>
            <div>
                <Link to="login">Login/Logout</Link>
            </div>
            <div>
                <Link to="tasks">Tasks</Link>
            </div>
            <div>
                <Link to="assignments">Assignments</Link>
            </div>
        </div>
    );
}
