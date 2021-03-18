import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppState } from 'react-native';
import { Appbar } from 'react-native-paper';
import { dateUtils } from '@logan/core';
import { beginFetching, finishFetching } from '@logan/fe-shared/store/fetch-status';
import { fetchTasks } from '@logan/fe-shared/store/tasks';
import { fetchAssignments } from '@logan/fe-shared/store/assignments';
import { fetchSchedule } from '@logan/fe-shared/store/schedule';
import { fetchReminders } from '@logan/fe-shared/store/reminders';
import { fetchSelf } from '@logan/fe-shared/store/login';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.fetch = this.fetch.bind(this);
        this.openSettings = this.openSettings.bind(this);
        this.shouldShowBackButton = this.shouldShowBackButton.bind(this);

        this.state = {
            isFetching: false,
            appState: AppState.currentState,
        };
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange.bind(this));
        this.fetch();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
    }

    handleAppStateChange(nextState) {
        if (this.props.leftActionIsFetch) {
            if (this.state.appState.match(/inactive|background/) && nextState === 'active') {
                // App has moved to the foreground
                const lastFetch = dateUtils.toDateTime(this.props.lastFetch);
                const threshold = dateUtils.dayjs().subtract(5, 'minute');

                if (lastFetch.isBefore(threshold)) this.fetch();
            }
        }

        this.setState({ appState: nextState });
    }

    async fetch() {
        if (this.props.isFetching) return;

        this.props.beginFetching();

        const fetchers = [
            this.props.fetchTasks(),
            this.props.fetchAssignments(),
            this.props.fetchSchedule(),
            this.props.fetchReminders(),
            this.props.fetchSelf(),
        ];

        await Promise.all(fetchers);

        this.props.finishFetching();
    }

    shouldShowBackButton() {
        return !this.props.disableBack && this.props.navigation.canGoBack();
    }

    openSettings() {
        this.props.navigation.navigate('Settings');
    }

    render() {
        return (
            <Appbar.Header style={{ elevation: 0, shadowOpacity: 0 }} dark>
                {this.shouldShowBackButton() && <Appbar.BackAction onPress={this.props.navigation.goBack} />}
                {this.props.leftActionIsFetch ? (
                    <Appbar.Action disabled={this.state.isFetching} icon="sync" onPress={this.fetch} />
                ) : (
                    this.props.leftActions
                )}
                <Appbar.Content
                    title={this.props.title || this.props.route.name}
                    titleStyle={{ fontFamily: 'Rubik500' }}
                />
                {this.props.rightActionIsSetting ? (
                    <Appbar.Action icon="settings" onPress={this.openSettings} />
                ) : (
                    this.props.rightActions
                )}
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
    fetchSelf: PropTypes.func,
    rightActionIsSetting: PropTypes.bool,
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
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
