import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createAssignment } from 'packages/fe-shared/store/assignments';
import Editor from 'packages/fe-shared/components/editor';
import ViewController from '../shared/view-controller';
import AssignmentEditor from './assignment-editor';

class NewAssignmentModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);

        this.state = {
            assignment: {},
        };
    }

    close() {
        this.props.navigation.goBack();
    }

    async create() {
        await this.props.createAssignment(this.state.assignment);
        this.close();
    }

    update(assignment) {
        this.setState({ assignment });
    }

    render() {
        const leftActions = <Appbar.Action icon="close" onPress={this.close} />;
        const rightActions = (
            <Appbar.Action
                disabled={_.isEmpty(this.state.assignment.title)}
                icon={props => <Icon {...props} name="done" color="white" size={24} />}
                onPress={this.create}
            />
        );

        return (
            <ViewController
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActions={leftActions}
                rightActions={rightActions}
            >
                <ScrollView keyboardDismissMode="on-drag">
                    <AssignmentEditor
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

NewAssignmentModal.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    createAssignment: PropTypes.func,
};

const mapDispatchToState = {
    createAssignment,
};

export default connect(null, mapDispatchToState)(NewAssignmentModal);
