import React from 'react';
import _ from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@logan/fe-shared/utils/api';
import { fetchSelf, LOGIN_STAGE, setLoginStage } from '@logan/fe-shared/store/login';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MobileLoginButton from '../components/home/mobile-login-button';
import Typography from '../components/shared/typography';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        if (await api.hasStashedBearer()) {
            this.props.setLoginStage(LOGIN_STAGE.DONE);
            this.props.navigation.navigate('Root');
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
            await this.props.fetchSelf();
            this.props.setLoginStage(LOGIN_STAGE.DONE);
            this.props.navigation.navigate('Root');
        } else if (this.props.loginStage === LOGIN_STAGE.CREATE) {
            this.props.navigation.navigate('Signup');
        }
    }

    render() {
        return (
            <SafeAreaView>
                <Typography variant="h3">Welcome to Logan</Typography>
                <MobileLoginButton />
            </SafeAreaView>
        );
    }
}

Home.propTypes = {
    navigation: PropTypes.object,
    loginStage: PropTypes.string,
    setLoginStage: PropTypes.func,
    fetchSelf: PropTypes.func,
};

const mapStateToProps = state => ({
    loginStage: state.login.currentStage,
});

const mapDispatchToProps = {
    setLoginStage,
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
