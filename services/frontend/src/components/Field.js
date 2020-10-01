import React from 'react';

export const field = (props) => {
    return <input {...props.input} type={props.type} placeholder={props.placeholder} />;
};
