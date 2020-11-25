import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import Editor from '@logan/fe-shared/components/editor';
//import _ from 'lodash';
import ViewController from '../shared/view-controller';
import AssignmentEditor from './assignment-editor';
import SubtasksList from './subtasks-list';

class AssignmentDetails extends React.Component {
    constructor(props) {
        super(props, { id: 'aid', entity: 'assignment', mobile: true });
        this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdate(assignment) {
        this.setState({ assignment });
    }

    render() {
        //TODO: Generalize this maybe?
        return (
            <ViewController title="Assignment" navigation={this.props.navigation} route={this.props.route}>
                <ScrollView keyboardDismissMode="on-drag">
                    <AssignmentEditor
                        route={this.props.route}
                        navigation={this.props.navigation}
                        mode={Editor.Mode.Edit}
                        onChange={this.onUpdate}
                    />
                </ScrollView>
                <SubtasksList route={this.props.route} navigation={this.props.navigation} />
            </ViewController>
        );
    }
}

AssignmentDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default AssignmentDetails;
