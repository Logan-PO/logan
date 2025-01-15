import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import { getCurrentTheme } from '../../../globals/theme';
import { variants as customVariants } from '../typography';
import styles from './text-input.module.scss';

const TextInput = ({ variant = 'body1', ...rest }) => {
    const theme = getCurrentTheme();

    let variantStyle = {};

    if (variant) {
        variantStyle = theme.typography[variant] || customVariants[variant] || {};
    }

    return (
        <Input
            {...rest}
            classes={{ input: styles.textInput, ...rest.classes }}
            inputProps={{ style: variantStyle, ...rest.inputProps }}
            disableUnderline
        />
    );
};

TextInput.propTypes = {
    variant: PropTypes.string,
};

export default TextInput;
