import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import theme from '../../../globals/theme';

class EmptySticker extends React.Component {
    render() {
        return (
            <Grid
                container
                alignItems="center"
                justify="center"
                alignContent="center"
                style={{
                    width: '100%',
                    height: '100%',
                    background: theme.palette.action.disabledBackground,
                }}
            >
                <Grid item>
                    <Typography color="textSecondary">{this.props.message}</Typography>
                </Grid>
            </Grid>
        );
    }
}

EmptySticker.propTypes = {
    message: PropTypes.string,
};

export default EmptySticker;
