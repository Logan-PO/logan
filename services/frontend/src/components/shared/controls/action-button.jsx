import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ButtonBase from '@mui/material/ButtonBase';
import { getCurrentTheme } from '../../../globals/theme';
import Typography from '../typography';
import styles from './action-button.module.scss';

const SIZES = ['small', 'medium', 'large'];

/**
 * A simple rounded button. Can be sized "small" or "large"
 */
class ActionButton extends React.Component {
    constructor(props) {
        super(props);

        this.buttonRef = React.createRef();

        const { size = 'large' } = props;

        if (!SIZES.includes(size)) {
            console.warn(`Invalid size '${size}' for ActionButton. Defaulting to 'medium'`);
        }

        this.state = {
            currentHeight: 40,
            borderRadius: 20,
        };
    }

    componentDidMount() {
        this.setState({
            currentHeight: this.buttonRef.current.offsetHeight,
            borderRadius: this.buttonRef.current.offsetHeight / 2,
        });
    }

    componentDidUpdate() {
        const newHeight = this.buttonRef.current.offsetHeight;

        if (newHeight !== this.state.currentHeight) {
            this.setState({
                currentHeight: newHeight,
                borderRadius: newHeight / 2,
            });
        }
    }

    render() {
        let { children, color = 'primary', textColor, size = 'medium', className = '', ...rest } = this.props;

        if (!SIZES.includes(size)) {
            size = 'medium';
        }

        const buttonStyle = {
            borderRadius: this.state.borderRadius,
        };

        const typographyStyle = {};

        const theme = getCurrentTheme();

        if (_.get(theme.palette, [color, 'main']) && _.get(theme.palette, [color, 'contrastText'])) {
            buttonStyle.backgroundColor = theme.palette[color].main;
            buttonStyle.color = theme.palette[color].contrastText;
        } else if (color === 'white') {
            buttonStyle.backgroundColor = 'white';
            buttonStyle.color = theme.palette.primary.main;
        }

        if (textColor) buttonStyle.color = textColor;

        let typographyVariant;

        let buttonClass;

        switch (size) {
            case 'large':
                typographyStyle.fontSize = '24px';
                typographyStyle.lineHeight = '1em';
                buttonClass = styles.actionButtonLarge;
                break;
            case 'medium':
                typographyVariant = 'body1';
                buttonClass = styles.actionButtonMedium;
                break;
            case 'small':
                typographyVariant = 'detail';
                buttonClass = styles.actionButtonSmall;
                break;
            default:
                break;
        }

        return (
            <ButtonBase
                style={buttonStyle}
                className={`${buttonClass} ${className}`}
                ref={this.buttonRef}
                {..._.omit(rest, 'dispatch')}
            >
                <Typography style={typographyStyle} variant={typographyVariant}>
                    {children}
                </Typography>
            </ButtonBase>
        );
    }
}

ActionButton.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    textColor: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.string,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

export default connect(mapStateToProps, undefined)(ActionButton);
