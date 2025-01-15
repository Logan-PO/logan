import React from 'react';
import _ from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import api from 'packages/fe-shared/utils/api';
import { fetchSelf, LOGIN_STAGE, setLoginStage } from 'packages/fe-shared/store/login';
import { updateUser } from 'packages/fe-shared/store/settings';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Typography from '../shared/typography';
import NavigationButton from '../tutorial/navigation-button';
import { handleNotificationsPermissions } from '../../globals/permissions';
import MobileLoginButton from './mobile-login-button';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.requestPermissions = this.requestPermissions.bind(this);
    }

    async componentDidMount() {
        if (await api.hasStashedBearer()) {
            await new Promise(resolve => setTimeout(resolve, 150));
            this.props.setLoginStage(LOGIN_STAGE.LOGGED_IN);
        } else {
            console.log('No stashed bearer');
        }
    }

    /*
    When the login stage is updated, we want to either navigate to the tasks screen or
    navigate to the create users screen
     */
    async componentDidUpdate(prevProps) {
        //Do nothing if state doesn't update meaningfully
        if (_.isEqual(this.props, prevProps)) return;

        if (this.props.loginStage === LOGIN_STAGE.LOGGED_IN) {
            this.props.setLoginStage(LOGIN_STAGE.DONE);
            await this.props.fetchSelf();
            await this.requestPermissions();
            this.props.navigation.navigate('Root');
        } else if (this.props.loginStage === LOGIN_STAGE.CREATE) {
            this.props.navigation.navigate('Signup');
        }
    }

    async requestPermissions() {
        const { stashed, current } = await handleNotificationsPermissions();

        const user = { tokens: [], ...this.props.user };

        if (stashed && !current) {
            console.log('Notification permissions not granted. Removing stashed push token');

            if (user.tokens.length && user.tokens.includes(stashed)) {
                user.tokens = _.reject(user.tokens, token => token === stashed);
                await this.props.updateUser(user);
            }
        } else if (current !== stashed) {
            console.log('Device push notification token has changed. Updating');

            if (user.tokens.length && user.tokens.includes(stashed)) {
                user.tokens = _.reject(user.tokens, token => token === stashed);
            }

            user.tokens.push(current);

            await this.props.updateUser(user);
        }
    }

    render() {
        return (
            <SafeAreaView
                style={{
                    backgroundColor: 'teal',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 32,
                }}
            >
                <View style={{ flex: 1 }} />
                <StatusBar style="light" />
                <Typography style={{ marginBottom: 30 }} variant="h3" color="white">
                    Logan
                </Typography>
                <MobileLoginButton mode="contained" color="white" />
                <View style={{ flex: 1 }} />
                <NavigationButton
                    mode="text"
                    destination="Tutorial Root"
                    text="Tutorial"
                    navigation={this.props.navigation}
                    color="white"
                    textColor="white"
                />
            </SafeAreaView>
        );
    }
}

Home.propTypes = {
    navigation: PropTypes.object,
    loginStage: PropTypes.string,
    setLoginStage: PropTypes.func,
    fetchSelf: PropTypes.func,
    user: PropTypes.object,
    updateUser: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
    loginStage: state.login.currentStage,
});

const mapDispatchToProps = {
    setLoginStage,
    fetchSelf,
    updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
