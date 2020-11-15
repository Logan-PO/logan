import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { View, SectionList } from 'react-native';
import { List } from 'react-native-paper';
import SegmentedControl from '@react-native-community/segmented-control';
import { getTasksSelectors } from '@logan/fe-shared/store/tasks';
import { getSections } from '@logan/fe-shared/sorting/tasks';
import theme from '../../globals/theme';
import TaskCell from '../../components/tasks/task-cell';

class TasksList extends React.Component {
    constructor(props) {
        super(props);

        this.openTask = this.openTask.bind(this);

        this.state = {
            showingCompletedTasks: false,
        };
    }

    openTask(tid) {
        this.props.navigation.push('Task', { tid });
    }

    render() {
        const tasks = _.filter(this.props.tasks, task => task.complete === this.state.showingCompletedTasks);
        const sections = getSections(tasks, this.state.showingCompletedTasks);
        const listData = sections.map(([name, tids]) => ({ title: name, data: tids }));

        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        padding: 12,
                        paddingTop: 0,
                        backgroundColor: theme.colors.primary,
                    }}
                >
                    <SegmentedControl
                        values={['Incomplete tasks', 'Completed tasks']}
                        selectedIndex={this.state.showingCompletedTasks ? 1 : 0}
                        onChange={event =>
                            this.setState({ showingCompletedTasks: !!event.nativeEvent.selectedSegmentIndex })
                        }
                        tintColor="white"
                    />
                </View>
                <SectionList
                    style={{ height: '100%', backgroundColor: 'white' }}
                    sections={listData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <TaskCell
                            key={item}
                            tid={item}
                            showOverdueLabel={!this.state.showingCompletedTasks}
                            onPress={() => this.openTask(item)}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <List.Subheader style={{ backgroundColor: 'white' }} key={title}>
                            {title}
                        </List.Subheader>
                    )}
                />
                <StatusBar style="light" />
            </View>
        );
    }
}

TasksList.propTypes = {
    tasks: PropTypes.array,
    fetchTasks: PropTypes.func,
    navigation: PropTypes.object,
};

const mapStateToProps = state => ({
    tasks: getTasksSelectors(state.tasks).selectAll(),
});

export default connect(mapStateToProps, null)(TasksList);