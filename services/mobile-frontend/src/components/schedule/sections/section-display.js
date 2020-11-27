import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import Editor from '@logan/fe-shared/components/editor';
import ViewController from '../../shared/view-controller';
import SectionEditor from './section-editor';

class SectionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdate(section) {
        this.setState({ section });
    }

    render() {
        return (
            <ViewController title="Section Details" navigation={this.props.navigation} route={this.props.route}>
                <ScrollView keyboardDismissMode="on-drag">
                    <SectionEditor
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

SectionDisplay.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default SectionDisplay;
