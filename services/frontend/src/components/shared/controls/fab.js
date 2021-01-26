import React from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const Fab = ({ children, onClick, style, ...rest }) => {
    const defaultStyle = {
        background: 'var(--color-primary)',
        color: 'white',
        width: 56,
        height: 56,
        borderRadius: '50%',
    };

    if (!children) {
        children = <AddIcon />;
    }

    return (
        <ButtonBase style={{ ...defaultStyle, ...style }} onClick={onClick} {...rest}>
            {children}
        </ButtonBase>
    );
};

Fab.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    onClick: PropTypes.func,
};

export default Fab;
