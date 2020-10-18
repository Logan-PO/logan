import React from 'react';
import { Link } from 'gatsby';

export default function Home() {
    return (
        <div>
            <div>Hello world!</div>
            <Link to="login">Login/Logout</Link>
        </div>
    );
}
