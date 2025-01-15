import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getCurrentTheme } from '../../../globals/theme';

const Fab = ({ children, onClick, style, ...rest }) => {
    const defaultStyle = {
        background: getCurrentTheme().palette.primary.main,
        color: 'white',
        width: 56,
        height: 56,
        borderRadius: '50%',
    };

    if (!children) {
        children = <AddIcon />;
    }

    return (
        <ButtonBase style={{ ...defaultStyle, ...style }} onClick={onClick} {..._.omit(rest, 'dispatch')}>
            {children}
        </ButtonBase>
    );
};

Fab.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    onClick: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

export default connect(mapStateToProps)(Fab);
