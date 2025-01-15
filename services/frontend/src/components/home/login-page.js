import _ from 'lodash';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { colors } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import api from 'packages/fe-shared/utils/api';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from 'packages/fe-shared/store/login';
import Typography from '../shared/typography';
import { headingsFontFamily } from '../../globals/theme';
import TextButton from '../shared/controls/text-button';
import GoogleBtn from './GoogleButton';
import styles from './home-page.module.scss';
import loginStyles from './login-page.module.scss';

class LoginPage extends React.Component {
    async componentDidMount() {
        const hasStashedBearer = await api.hasStashedBearer();
        if (hasStashedBearer) {
            this.props.setLoginStage(LOGIN_STAGE.DONE);
        }
    }

    async componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        if (this.props.loginStage === LOGIN_STAGE.LOGGED_IN) {
            await this.props.fetchSelf();
            this.props.setLoginStage(LOGIN_STAGE.DONE);
            navigate('/tasks');
        } else if (this.props.loginStage === LOGIN_STAGE.DONE) {
            await this.props.fetchSelf();
            navigate('/tasks');
        }
    }

    render() {
        return (
            <div
                className={styles.homePage}
                style={{ background: colors.teal[500], '--headings-family': headingsFontFamily }}
            >
                <Helmet>
                    <title>Logan / Log In</title>
                </Helmet>
                <div className={loginStyles.topLeftContainer} style={{ alignItems: 'flex-start' }}>
                    <TextButton IconComponent={ArrowBackIcon} size="large" color="white" onClick={() => navigate('/')}>
                        Back home
                    </TextButton>
                </div>
                <div className={styles.contentContainer}>
                    <Typography variant="title">Log In</Typography>
                    <Typography variant="subtitle">Sign in to Logan using your Google account</Typography>
                    <GoogleBtn />
                    <Typography variant="big-body">More ways to log in coming soon!</Typography>
                </div>
            </div>
        );
    }
}

LoginPage.propTypes = {
    user: PropTypes.object,
    loginStage: PropTypes.string,
    setLoginStage: PropTypes.func,
    fetchSelf: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
    loginStage: state.login.currentStage,
});

const mapDispatchToProps = {
    setLoginStage,
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
