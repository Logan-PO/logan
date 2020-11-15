import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import { getTasksSelectors } from '@logan/fe-shared/store/tasks';

class TaskDetails extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        const { tid } = props.route.params;

        this.state = {
            task: props.getTask(tid),
        };
    }

    handleChange(prop, value) {
        const changes = {};

        changes[prop] = value;

        const updatedTask = _.merge({}, this.state.task, changes);

        this.setState({ task: updatedTask });
    }

    render() {
        return (
            <ScrollView>
                <View style={{ flexDirection: 'column', padding: 12, paddingBottom: 24, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Checkbox.Android />
                        <TextInput
                            style={{ flexGrow: 1, backgroundColor: 'none' }}
                            mode="flat"
                            label="Title"
                            value={this.state.task.title}
                            onChangeText={this.handleChange.bind(this, 'title')}
                        />
                    </View>
                    <View>
                        <TextInput
                            multiline
                            label="Description"
                            mode="flat"
                            style={{ backgroundColor: 'none' }}
                            value={this.state.task.description}
                            onChangeText={this.handleChange.bind(this, 'description')}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

TaskDetails.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    getTask: PropTypes.func,
};

const mapStateToProps = state => ({
    getTask: getTasksSelectors(state.tasks).selectById,
});

export default connect(mapStateToProps, null)(TaskDetails);
