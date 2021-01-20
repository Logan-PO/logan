import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { colors } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import api from '@logan/fe-shared/utils/api';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from '@logan/fe-shared/store/login';
import Typography from '../shared/typography';
import ActionButton from '../shared/controls/action-button';
import { headingsFontFamily } from '../../globals/theme';
import TextButton from '../shared/controls/text-button';
import GoogleBtn from './GoogleButton';
import SignUpForm from './signup-form';
import styles from './home-page.module.scss';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.openCreateAccount = this.openCreateAccount.bind(this);
        this.modalClosed = this.modalClosed.bind(this);

        this.state = {
            createModalOpen: false,
        };
    }

    async componentDidMount() {
        const hasStashedBearer = await api.hasStashedBearer();
        if (hasStashedBearer) {
            this.props.setLoginStage(LOGIN_STAGE.DONE);
            return this.props.fetchSelf();
        }
    }

    async componentDidUpdate(prevProps) {
        if (_.isEqual(this.props, prevProps)) return;

        if (this.props.loginStage === LOGIN_STAGE.LOGGED_IN) {
            await this.props.fetchSelf();
            this.props.setLoginStage(LOGIN_STAGE.DONE);
            navigate('/tasks');
        } else if (this.props.loginStage === LOGIN_STAGE.CREATE) {
            this.setState({ createModalOpen: true });
        }
    }

    openCreateAccount() {
        this.setState({ createModalOpen: true });
    }

    modalClosed() {
        this.setState({ createModalOpen: false });
    }

    render() {
        const alreadyLoggedIn = this.props.loginStage === LOGIN_STAGE.DONE && this.props.user;

        return (
            <div
                className={styles.homePage}
                style={{ background: colors.teal[500], '--headings-family': headingsFontFamily }}
            >
                <div className={styles.contentContainer}>
                    <Typography variant="title">Meet Logan</Typography>
                    <Typography variant="subtitle">
                        An intuitive personal organizer.
                        <br />
                        Designed for students, by students.
                    </Typography>
                    <ActionButton size="large" color="white" textColor={colors.teal[500]}>
                        Learn more
                        <ArrowDownwardIcon style={{ margin: '0 -4px 0 4px' }} />
                    </ActionButton>
                </div>
                <div className={styles.getStartedContainer}>
                    {alreadyLoggedIn ? (
                        <React.Fragment>
                            <Typography>Looks like you’re already signed in as {this.props.user.name}</Typography>
                            <ActionButton
                                size="medium"
                                color="white"
                                textColor={colors.teal[500]}
                                onClick={() => navigate('/tasks')}
                            >
                                Enter Logan
                                <ArrowForwardIcon fontSize="inherit" style={{ margin: '0 -4px 0 4px' }} />
                            </ActionButton>
                            <div style={{ display: 'flex', marginTop: 4 }}>
                                <Typography>Not you?&nbsp;&nbsp;</Typography>
                                <GoogleBtn
                                    logoutProps={{
                                        render: ({ onClick }) => (
                                            <TextButton
                                                color="white"
                                                size="large"
                                                classes={{ text: styles.textButton }}
                                                onClick={onClick}
                                            >
                                                Log out
                                            </TextButton>
                                        ),
                                    }}
                                />
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography>Ready to get started?</Typography>
                            <div style={{ display: 'flex' }}>
                                <TextButton
                                    color="white"
                                    size="large"
                                    classes={{ text: styles.textButton }}
                                    onClick={() => navigate('/login')}
                                >
                                    Log in
                                </TextButton>
                                <Typography style={{ fontFamily: headingsFontFamily }}>&nbsp;/&nbsp;</Typography>
                                <TextButton
                                    color="white"
                                    size="large"
                                    classes={{ text: styles.textButton }}
                                    onClick={this.openCreateAccount}
                                >
                                    Create account
                                </TextButton>
                            </div>
                        </React.Fragment>
                    )}
                </div>
                <SignUpForm open={this.state.createModalOpen} onClose={this.modalClosed} />
            </div>
        );
    }
}

HomePage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
