import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from '../../store/login';
import GoogleBtn from './GoogleButton';

class LoginPage extends React.Component {
    async componentDidUpdate() {
        if (this.props.loginStage === LOGIN_STAGE.LOGGED_IN) {
            await this.props.fetchSelf();
            this.props.setLoginStage(LOGIN_STAGE.DONE);
            navigate('../');
        } else if (this.props.loginStage === LOGIN_STAGE.CREATE) {
            navigate('../signup');
        }
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Welcome to Logan!</h1>
                </div>
                <GoogleBtn />
                <div>
                    <h1>About Logan</h1>
                    <p>Stuff about Logan goes here.</p>
                </div>
            </div>
        );
    }
}

LoginPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
