import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';
import { getCurrentTheme } from '../../../globals/theme';
import Typography from '../typography';
import styles from './action-button.module.scss';

class ActionButton extends React.Component {
    constructor(props) {
        super(props);

        this.buttonRef = React.createRef();

        const { size = 'large' } = props;

        if (!(size === 'large' || size === 'small')) {
            console.warn(`Invalid size '${size}' for ActionButton. Defaulting to 'large'`);
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
        let { children, color = 'primary', textColor, size = 'large', ...rest } = this.props;

        if (!(size === 'large' || size === 'small')) {
            size = 'large';
        }

        let buttonClass;

        switch (size) {
            case 'large':
                buttonClass = styles.actionButtonLarge;
                break;
            case 'small':
                buttonClass = styles.actionButtonSmall;
                break;
            default:
                break;
        }

        const colorStyle = {
            borderRadius: this.state.borderRadius,
        };

        const theme = getCurrentTheme();

        if (_.get(theme.palette, [color, 'main']) && _.get(theme.palette, [color, 'contrastText'])) {
            colorStyle.backgroundColor = theme.palette[color].main;
            colorStyle.color = theme.palette[color].contrastText;
        } else if (color === 'white') {
            colorStyle.backgroundColor = 'white';
            colorStyle.color = theme.palette.primary.main;
        }

        if (textColor) colorStyle.color = textColor;

        const typographyVariant = size === 'small' ? 'detail' : 'body1';

        return (
            <ButtonBase style={colorStyle} className={buttonClass} ref={this.buttonRef} {...rest}>
                <Typography variant={typographyVariant}>{children}</Typography>
            </ButtonBase>
        );
    }
}

ActionButton.propTypes = {
    color: PropTypes.string,
    textColor: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.string,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

export default connect(mapStateToProps, undefined)(ActionButton);
