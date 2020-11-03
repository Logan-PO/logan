import React from 'react';
import { Button } from 'react-native';
import PropTypes from 'prop-types';

class Assignments extends React.Component {
    render() {
        let { navigation } = this.props;
        return <Button title="Go to tasks" onPress={() => navigation.navigate('Tasks')} />;
    }
}

Assignments.propTypes = {
    navigation: PropTypes.any,
};

export default Assignments;
