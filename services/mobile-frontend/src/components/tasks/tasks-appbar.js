import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { fetchTasks } from '@logan/fe-shared/store/tasks';

class TasksAppbar extends React.Component {
    constructor(props) {
        super(props);

        this.fetch = this.fetch.bind(this);

        this.state = {
            isFetching: false,
        };
    }

    async setStateSync(update) {
        return new Promise(resolve => this.setState(update, resolve));
    }

    async fetch() {
        await this.setStateSync({ isFetching: true });
        await this.props.fetchTasks();
        await this.setStateSync({ isFetching: false });
    }

    render() {
        const { options } = this.props.scene.descriptor;
        const title =
            options.headerTitle !== undefined
                ? options.headerTitle
                : options.title !== undefined
                ? options.title
                : this.props.scene.route.name;

        return (
            <Appbar.Header style={{ elevation: 0, shadowOpacity: 0 }}>
                {this.props.previous ? (
                    <Appbar.BackAction onPress={this.props.navigation.goBack} />
                ) : (
                    <Appbar.Action disabled={this.state.isFetching} icon="sync" onPress={this.fetch} />
                )}
                <Appbar.Content title={title} />
            </Appbar.Header>
        );
    }
}

TasksAppbar.propTypes = {
    scene: PropTypes.object,
    previous: PropTypes.object,
    navigation: PropTypes.object,
    fetchTasks: PropTypes.func,
};

const mapDispatchToProps = {
    fetchTasks,
};

export default connect(null, mapDispatchToProps)(TasksAppbar);
