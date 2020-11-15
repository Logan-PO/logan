import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { fetchTasks } from '@logan/fe-shared/store/tasks';
import { fetchAssignments } from '@logan/fe-shared/store/assignments';
import { fetchSchedule } from '@logan/fe-shared/store/schedule';
import { fetchReminders } from '@logan/fe-shared/store/reminders';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.fetch = this.fetch.bind(this);

        this.state = {
            isFetching: false,
        };
    }

    componentDidMount() {
        this.fetch();
    }

    async setStateSync(update) {
        return new Promise(resolve => this.setState(update, resolve));
    }

    async fetch() {
        await this.setStateSync({ isFetching: true });

        await Promise.all([
            this.props.fetchTasks(),
            this.props.fetchAssignments(),
            this.props.fetchSchedule(),
            this.props.fetchReminders,
        ]);

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

Header.propTypes = {
    scene: PropTypes.object,
    previous: PropTypes.object,
    navigation: PropTypes.object,
    fetchTasks: PropTypes.func,
    fetchAssignments: PropTypes.func,
    fetchSchedule: PropTypes.func,
    fetchReminders: PropTypes.func,
};

const mapDispatchToProps = {
    fetchTasks,
    fetchAssignments,
    fetchSchedule,
    fetchReminders,
};

export default connect(null, mapDispatchToProps)(Header);
