import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, colors } from '@mui/material';

class EmptySticker extends React.Component {
    render() {
        return (
            <Grid
                container
                alignItems="center"
                justify="center"
                alignContent="center"
                style={{
                    padding: '3rem',
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    color: colors.grey[500],
                }}
            >
                <Grid item>
                    <Typography>{this.props.message}</Typography>
                </Grid>
            </Grid>
        );
    }
}

EmptySticker.propTypes = {
    message: PropTypes.string,
};

export default EmptySticker;
