import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text, List, Checkbox } from 'react-native-paper';
import { getTasksSelectors, updateTask, updateTaskLocal } from '@logan/fe-shared/store/tasks';
import { dateUtils } from '@logan/core';
import { red } from 'material-ui-colors';

class TaskCell extends React.Component {
    constructor(props) {
        super(props);

        this.check = this.check.bind(this);

        this.state = {
            task: props.getTask(props.tid),
        };
    }

    componentDidUpdate() {
        const storeTask = this.props.getTask(this.props.tid);

        if (!_.isEqual(storeTask, this.state.task)) {
            this.setState({ task: storeTask });
        }
    }

    check() {
        this.handleChange('complete', !this.state.task.complete);
    }

    handleChange(prop, newValue) {
        const changes = {};

        changes[prop] = newValue;

        if (changes.complete) {
            changes.completionDate = dateUtils.formatAsDateTime();
        }

        const afterUpdates = _.merge({}, this.state.task, changes);

        this.setState({
            task: afterUpdates,
        });

        this.props.updateTaskLocal({
            id: this.props.tid,
            changes,
        });

        this.props.updateTask(afterUpdates);
    }

    shouldShowOverdueLabel() {
        if (!this.props.showOverdueLabel) return false;
        if (!dateUtils.dueDateIsDate(this.state.task.dueDate)) return false;

        const dateValue = dateUtils.toDate(this.state.task.dueDate);
        return dateValue.isBefore(dateUtils.dayjs(), 'day');
    }

    overdueLabelContent() {
        const dateValue = dateUtils.toDate(this.state.task.dueDate);
        const days = dateUtils.dayjs().diff(dateValue, 'day');

        if (days === 1) {
            return 'Due yesterday';
        } else {
            return `Due ${days} days ago`;
        }
    }

    render() {
        if (!this.state.task) return <List.Item />;

        const checkboxStatus = this.state.task.complete ? 'checked' : 'unchecked';

        return (
            <List.Item
                style={{ backgroundColor: 'white' }}
                title={
                    <View style={{ flexDirection: 'column' }}>
                        <View>
                            <Text style={{ fontSize: 16 }}>{this.state.task.title}</Text>
                        </View>
                        {this.shouldShowOverdueLabel() && (
                            <View style={{ marginTop: 2 }}>
                                <Text style={{ fontSize: 16, color: red[500] }} allowFontScaling>
                                    {this.overdueLabelContent()}
                                </Text>
                            </View>
                        )}
                    </View>
                }
                titleNumberOfLines={this.shouldShowOverdueLabel() ? 2 : 1}
                description={this.state.task.description}
                left={() => <Checkbox.Android status={checkboxStatus} onPress={this.check} />}
            />
        );
    }
}

TaskCell.propTypes = {
    tid: PropTypes.string,
    getTask: PropTypes.func,
    updateTask: PropTypes.func,
    updateTaskLocal: PropTypes.func,
    showOverdueLabel: PropTypes.bool,
};

const mapStateToProps = state => ({
    getTask: getTasksSelectors(state.tasks).selectById,
});

const mapDispatchToProps = {
    updateTask,
    updateTaskLocal,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskCell);
