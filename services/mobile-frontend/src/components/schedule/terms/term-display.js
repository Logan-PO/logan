import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import Editor from '@logan/fe-shared/components/editor';
import ViewController from '../../shared/view-controller';
import TermEditor from './term-editor';

class TermDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdate(term) {
        this.setState({ term });
    }

    render() {
        return (
            <ViewController title="Term" navigation={this.props.navigation} route={this.props.route}>
                <ScrollView keyboardDismissMode="on-drag">
                    <TermEditor
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

TermDisplay.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default TermDisplay;
