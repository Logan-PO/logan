import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { Text, TextInput, Checkbox, List, Colors, Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { dateUtils } from '@logan/core';
import { getTasksSelectors, createTask } from '@logan/fe-shared/store/tasks';
import { getCourseSelectors } from '@logan/fe-shared/store/schedule';
import priorities from '../shared/priority-constants';
import ViewController from '../shared/view-controller';
import { colorStyles, typographyStyles } from '../shared/typography';
import DueDatePicker from '../shared/pickers/due-date-picker';

class NewTaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.toggleDueDatePicker = this.toggleDueDatePicker.bind(this);

        this.state = {
            task: {
                title: '',
                description: '',
                dueDate: dateUtils.formatAsDate(),
                priority: 0,
            },
            dueDatePickerOpen: false,
        };
    }

    toggleDueDatePicker() {
        this.setState({ dueDatePickerOpen: !this.state.dueDatePickerOpen });
    }

    handleChange(prop, value) {
        const newTask = _.merge({}, this.state.task, { [prop]: value });
        this.setState({ task: newTask });
    }

    close() {
        this.props.navigation.goBack();
    }

    async create() {
        await this.props.createTask(this.state.task);
        this.close();
    }

    render() {
        const course = this.props.getCourse(_.get(this.state.task, 'cid'));

        const priorityEntry = _.find(
            _.entries(priorities),
            // eslint-disable-next-line no-unused-vars
            ([name, [value, color]]) => value === this.state.task.priority
        );

        const priority = {
            name: priorityEntry[0],
            color: priorityEntry[1][1],
        };

        const leftActions = <Appbar.Action icon="close" onPress={this.close} />;
        const rightActions = (
            <Appbar.Action
                disabled={_.isEmpty(this.state.task.title)}
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
                    <View style={{ flexDirection: 'column', padding: 12, paddingBottom: 24, backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Checkbox.Android
                                status={this.state.task.complete ? 'checked' : 'unchecked'}
                                onPress={() => this.handleChange('complete', !this.state.task.complete)}
                            />
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
                    <List.Item
                        style={{ backgroundColor: 'white', paddingTop: 12, paddingBottom: 6 }}
                        title={
                            <View
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingRight: 8,
                                }}
                            >
                                <Text style={{ ...typographyStyles.body }}>Due Date</Text>
                                <Text
                                    style={{
                                        ...typographyStyles.body,
                                        ...colorStyles.secondary,
                                    }}
                                >
                                    {dateUtils.readableDueDate(this.state.task.dueDate)}
                                </Text>
                            </View>
                        }
                        onPress={this.toggleDueDatePicker}
                    />
                    {this.state.dueDatePickerOpen && (
                        <View style={{ backgroundColor: 'white', paddingBottom: 12 }}>
                            <DueDatePicker
                                value={this.state.task.dueDate}
                                onChange={this.handleChange.bind(this, 'dueDate')}
                            />
                        </View>
                    )}
                    <List.Item
                        style={{ backgroundColor: 'white' }}
                        title={
                            <View
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingRight: 4,
                                }}
                            >
                                <Text style={{ ...typographyStyles.body }}>Course</Text>
                                <Text
                                    style={{
                                        ...typographyStyles.body,
                                        color: _.get(course, 'color', Colors.grey500),
                                        fontWeight: course ? 'bold' : 'normal',
                                    }}
                                >
                                    {course ? course.title : 'None'}
                                </Text>
                            </View>
                        }
                        right={() => (
                            <Icon name="chevron-right" size={24} style={{ color: 'gray', alignSelf: 'center' }} />
                        )}
                        onPress={() =>
                            this.props.navigation.navigate('Course Picker', {
                                cid: _.get(course, 'cid'),
                                onSelect: this.handleChange.bind(this, 'cid'),
                            })
                        }
                    />
                    <List.Item
                        style={{ backgroundColor: 'white' }}
                        title={
                            <View
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingRight: 4,
                                }}
                            >
                                <Text style={{ ...typographyStyles.body }}>Priority</Text>
                                <Text
                                    style={{
                                        ...typographyStyles.body,
                                        fontWeight: 'bold',
                                        color: priority.color,
                                    }}
                                >
                                    {priority.name}
                                </Text>
                            </View>
                        }
                        right={() => (
                            <Icon name="chevron-right" size={24} style={{ color: 'gray', alignSelf: 'center' }} />
                        )}
                        onPress={() =>
                            this.props.navigation.navigate('Priority Picker', {
                                value: this.state.task.priority,
                                onSelect: this.handleChange.bind(this, 'priority'),
                            })
                        }
                    />
                </ScrollView>
            </ViewController>
        );
    }
}

NewTaskModal.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
    getTask: PropTypes.func,
    getCourse: PropTypes.func,
    createTask: PropTypes.func,
};

const mapStateToProps = state => ({
    getTask: getTasksSelectors(state.tasks).selectById,
    getCourse: getCourseSelectors(state.schedule).selectById,
});

const mapDispatchToState = {
    createTask,
};

export default connect(mapStateToProps, mapDispatchToState)(NewTaskModal);
