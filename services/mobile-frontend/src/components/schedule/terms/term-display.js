import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { FAB } from 'react-native-paper';
import Editor from '@logan/fe-shared/components/editor';
import ViewController from '../../shared/view-controller';
import TermEditor from './term-editor';

class TermDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.onUpdate = this.onUpdate.bind(this);

        this.state = {
            term: {},
            fabOpen: false,
        };
    }

    onUpdate(term) {
        this.setState({ term });
    }

    render() {
        return (
            <React.Fragment>
                <ViewController title="Term Detail" navigation={this.props.navigation} route={this.props.route}>
                    <ScrollView keyboardDismissMode="on-drag">
                        <TermEditor
                            route={this.props.route}
                            navigation={this.props.navigation}
                            mode={Editor.Mode.Edit}
                            onChange={this.onUpdate}
                        />
                    </ScrollView>
                </ViewController>
                <FAB.Group
                    open={this.state.fabOpen}
                    color="white"
                    icon="plus"
                    actions={[
                        {
                            icon: 'calendar',
                            label: 'Holiday',
                            onPress: () => {},
                        },
                        {
                            icon: 'calendar',
                            label: 'Course',
                            onPress: () => {},
                        },
                    ]}
                    onStateChange={({ open }) => this.setState({ fabOpen: open })}
                />
            </React.Fragment>
        );
    }
}

TermDisplay.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default TermDisplay;
