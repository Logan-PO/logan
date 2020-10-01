import React from 'react';

export const formatAssignmentsForView = (assignmentDay) => {
    assignmentDay.list.map((item) => (
        <li key={item.id}>
            <h3 style={{ backgroundColor: item.color }}>{item.class} </h3>
            <div>
                Assignment: {item.name}
                <div>Desc: {item.desc} </div>
                <div>Due: {item.day} </div>
                <button style={{ backgroundColor: 'darkgreen' }}>Edit Assignment</button>
                <button style={{ backgroundColor: 'red' }}>Delete Assignment</button>
            </div>
        </li>
    ));
};
