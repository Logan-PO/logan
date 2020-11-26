import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
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
                    <View>
                        <AssignmentEditor
                            route={this.props.route}
                            navigation={this.props.navigation}
                            mode={Editor.Mode.Edit}
                            onChange={this.onUpdate}
                        />
                    </View>
                    <View>
                        <SubtasksList
                            route={this.props.route}
                            navigation={this.props.navigation}
                            aid={this.props.route.params.aid}
                        />
                    </View>
                </ScrollView>
            </ViewController>
        );
    }
}

AssignmentDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default AssignmentDetails;
