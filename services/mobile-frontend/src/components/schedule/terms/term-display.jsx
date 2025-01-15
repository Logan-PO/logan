import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { FAB } from 'react-native-paper';
import ViewController from '../../shared/view-controller';
import TermEditor from './term-editor';
import Editor from 'packages/fe-shared/components/editor';

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
                <ViewController
                    ignoreMargins
                    title="Term Detail"
                    navigation={this.props.navigation}
                    route={this.props.route}
                >
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
                    icon={this.state.fabOpen ? 'close' : 'plus'}
                    actions={[
                        {
                            icon: 'plus',
                            label: 'Holiday',
                            onPress: () => this.props.navigation.navigate('New Holiday', { tid: this.state.term.tid }),
                        },
                        {
                            icon: 'plus',
                            label: 'Course',
                            onPress: () => this.props.navigation.navigate('New Course', { tid: this.state.term.tid }),
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
