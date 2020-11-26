import React from 'react';
import _ from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchSelf, LOGIN_STAGE, setLoginStage } from '@logan/fe-shared/store/login';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MobileLoginButton from '../components/home/mobile-login-button';

class Home extends React.Component {
    constructor(props) {
        super(props);
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
            //TODO: Go to tasks screen
        } else if (this.props.loginStage === LOGIN_STAGE.CREATE) {
            //TODO: Go to new user screen
        }
    }

    render() {
        return (
            <SafeAreaView>
                <MobileLoginButton />
            </SafeAreaView>
        );
    }
}

Home.propTypes = {
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
