import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-paper';

class NavigationButton extends React.Component {
    constructor(props) {
        super(props);

        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        this.props.navigation.navigate(this.props.destination);
    }

    render() {
        return <Button onPress={this.onPress}>{this.props.text}</Button>;
    }
}

NavigationButton.propTypes = {
    navigation: PropTypes.object,
    destination: PropTypes.string,
    text: PropTypes.string,
};

export default NavigationButton;
