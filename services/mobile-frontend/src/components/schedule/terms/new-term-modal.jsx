import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar } from 'react-native-paper';
import ViewController from '../../shared/view-controller';
import TermEditor from './term-editor';
import { dateUtils } from 'packages/core';
import { createTerm } from 'packages/fe-shared/store/schedule';
import Editor from 'packages/fe-shared/components/editor';

class NewTermModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);

        this.state = {
            term: {},
        };
    }

    close() {
        this.props.navigation.goBack();
    }

    async create() {
        await this.props.createTerm(this.state.term);
        this.close();
    }

    update(term) {
        this.setState({ term });
    }

    render() {
        let isValid = !_.isEmpty(this.state.term.title);

        const start = dateUtils.toDate(this.state.term.startDate);
        const end = dateUtils.toDate(this.state.term.endDate);

        if (!start.isBefore(end)) isValid = false;

        const leftActions = <Appbar.Action icon="close" onPress={this.close} />;
        const rightActions = (
            <Appbar.Action
                disabled={!isValid}
                icon={props => <Icon {...props} name="done" color="white" size={24} />}
                onPress={this.create}
            />
        );

        return (
            <ViewController
                title="New Term"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActions={leftActions}
                rightActions={rightActions}
            >
                <ScrollView keyboardDismissMode="on-drag">
                    <TermEditor
                        navigation={this.props.navigation}
                        route={this.props.route}
                        mode={Editor.Mode.Create}
                        onChange={this.update}
                    />
                </ScrollView>
            </ViewController>
        );
    }
}

NewTermModal.propTypes = {
    createTerm: PropTypes.func,
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const mapDispatchToState = {
    createTerm,
};

export default connect(null, mapDispatchToState)(NewTermModal);
