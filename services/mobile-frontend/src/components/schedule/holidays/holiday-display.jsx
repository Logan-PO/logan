import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import ViewController from '../../shared/view-controller';
import HolidayEditor from './holiday-editor';
import Editor from 'packages/fe-shared/components/editor';

class HolidayDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdate(holiday) {
        this.setState({ holiday });
    }

    render() {
        return (
            <ViewController title="Holiday Details" navigation={this.props.navigation} route={this.props.route}>
                <ScrollView keyboardDismissMode="on-drag">
                    <HolidayEditor
                        route={this.props.route}
                        navigation={this.props.navigation}
                        mode={Editor.Mode.Edit}
                        onChange={this.onUpdate}
                    />
                </ScrollView>
            </ViewController>
        );
    }
}

HolidayDisplay.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default HolidayDisplay;
