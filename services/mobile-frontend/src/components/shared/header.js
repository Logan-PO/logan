import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Appbar } from 'react-native-paper';
import { beginFetching, finishFetching } from '@logan/fe-shared/store/fetch-status';
import { fetchTasks } from '@logan/fe-shared/store/tasks';
import { fetchAssignments } from '@logan/fe-shared/store/assignments';
import { fetchSchedule } from '@logan/fe-shared/store/schedule';
import { fetchReminders } from '@logan/fe-shared/store/reminders';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.fetch = this.fetch.bind(this);
        this.shouldShowBackButton = this.shouldShowBackButton.bind(this);

        this.state = {
            isFetching: false,
        };
    }

    componentDidMount() {
        this.fetch();
    }

    async fetch() {
        if (this.props.isFetching) return;

        this.props.beginFetching();

        const fetchers = [
            this.props.fetchTasks(),
            this.props.fetchAssignments(),
            this.props.fetchSchedule(),
            this.props.fetchReminders(),
        ];

        await Promise.all(fetchers);

        this.props.finishFetching();
    }

    shouldShowBackButton() {
        return !this.props.disableBack && this.props.navigation.canGoBack();
    }

    render() {
        return (
            <Appbar.Header style={{ elevation: 0, shadowOpacity: 0 }}>
                {this.shouldShowBackButton() && <Appbar.BackAction onPress={this.props.navigation.goBack} />}
                {this.props.leftActionIsFetch ? (
                    <Appbar.Action disabled={this.state.isFetching} icon="sync" onPress={this.fetch} />
                ) : (
                    this.props.leftActions
                )}
                <Appbar.Content title={this.props.title || this.props.route.name} />
                {this.props.rightActions}
            </Appbar.Header>
        );
    }
}

Header.propTypes = {
    title: PropTypes.string,
    navigation: PropTypes.object,
    route: PropTypes.object,
    disableBack: PropTypes.bool,
    leftActionIsFetch: PropTypes.bool,
    leftActions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rightActions: PropTypes.object,
    fetchTasks: PropTypes.func,
    fetchAssignments: PropTypes.func,
    fetchSchedule: PropTypes.func,
    fetchReminders: PropTypes.func,
    beginFetching: PropTypes.func,
    finishFetching: PropTypes.func,
    isFetching: PropTypes.bool,
    lastFetch: PropTypes.string,
};

Header.defaultProps = {
    disableBack: false,
};

const mapStateToProps = state => ({
    isFetching: state.fetchStatus.fetching,
    lastFetch: state.fetchStatus.lastFetch,
});

const mapDispatchToProps = {
    beginFetching,
    finishFetching,
    fetchTasks,
    fetchAssignments,
    fetchSchedule,
    fetchReminders,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
