import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { colors } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Typography, { variants } from '../shared/typography';
import ActionButton from '../shared/controls/action-button';
import { headingsFontFamily } from '../../globals/theme';
import TextButton from '../shared/controls/text-button';
import GoogleBtn from './GoogleButton';
import SignUpForm from './signup-form';
import styles from './home-page.module.scss';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from 'packages/fe-shared/store/login';
import api from 'packages/fe-shared/utils/api';

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

        const sections = [
            {
                color: colors.teal[500],
                id: 'welcome',
                contents: (
                    <React.Fragment>
                        <Typography variant="title">Meet Logan</Typography>
                        <Typography variant="subtitle">
                            An intuitive personal organizer.
                            <br />
                            Designed for students, by students.
                        </Typography>
                        <ActionButton
                            size="large"
                            color="white"
                            textColor={colors.teal[500]}
                            onClick={makeScrollToFunction(1)}
                        >
                            Learn more
                            <ArrowDownwardIcon style={{ margin: '0 -4px 0 4px' }} />
                        </ActionButton>
                    </React.Fragment>
                ),
            },
            {
                color: '#a1208d',
                id: 'intro',
                contents: (
                    <React.Fragment>
                        <Typography variant="title">Overview</Typography>
                        <Typography variant="subtitle">
                            We created Logan to help us stay on top of the things we need to get done each day.
                        </Typography>
                        <Typography variant="subtitle">
                            At it’s core, it’s a powerful todo list, but there’s more to it than that.
                        </Typography>
                        <ActionButton size="large" color="white" textColor="#a1208d" onClick={makeScrollToFunction(2)}>
                            Next:&nbsp;<i>Assignments</i>
                        </ActionButton>
                    </React.Fragment>
                ),
            },
            {
                color: '#f74b28',
                id: 'assignments',
                contents: (
                    <React.Fragment>
                        <Typography variant="title">Assignments</Typography>
                        <Typography variant="subtitle">
                            In addition to keeping track of your tasks, Logan can track your assignments and due-dates
                            as well. Tasks can then be associated with your assignments, so you can easily plan out your
                            work and track your progress.
                        </Typography>
                        <Typography variant="subtitle">
                            It can also schedule reminders, so you never have to stress about forgetting that 11:59pm
                            deadline again.
                        </Typography>
                        <ActionButton size="large" color="white" textColor="#f74b28" onClick={makeScrollToFunction(3)}>
                            Next:&nbsp;<i>Scheduling</i>
                        </ActionButton>
                    </React.Fragment>
                ),
            },
            {
                color: '#3f51b5',
                id: 'schedule',
                contents: (
                    <React.Fragment>
                        <Typography variant="title">Scheduling</Typography>
                        <Typography variant="subtitle">
                            Logan also keeps track of your course schedule for you, making it easy to see what you have
                            going on each day.
                        </Typography>
                        <Typography variant="subtitle">
                            You can see an overview of your schedule and deadlines in a convenient calendar format, to
                            help you plan out your work most effectively.
                        </Typography>
                        <ActionButton size="large" color="white" textColor="#3f51b5" onClick={makeScrollToFunction(4)}>
                            What’s next?
                        </ActionButton>
                    </React.Fragment>
                ),
            },
            {
                color: '#607d8b',
                id: 'future',
                contents: (
                    <React.Fragment>
                        <Typography variant="title">Future Features (WIP)</Typography>
                        <ul>
                            <li style={variants.subtitle}>
                                <b>Group project support</b>
                                <br />
                                Share assignments with other users, and assign group members tasks to help keep track of
                                who’s doing what.
                            </li>
                            <br />
                            <li style={variants.subtitle}>
                                <b>Smart suggestions</b>
                                <br />
                                Integrations with Canvas, Google Classroom, and other similar services to automatically
                                suggest assignments when professors create them.
                            </li>
                        </ul>
                    </React.Fragment>
                ),
            },
        ];

        function makeScrollToFunction(index) {
            return () => {
                console.log(index);
                const id = sections[index].id;
                // eslint-disable-next-line no-undef
                const element = document.getElementById(id);
                window.scrollTo({
                    top: element.offsetTop,
                    left: 0,
                    behavior: 'smooth',
                });
            };
        }

        return (
            <div
                className={styles.homePage}
                style={{ background: colors.teal[500], '--headings-family': headingsFontFamily }}
            >
                <Helmet>
                    <title>Logan / Home</title>
                </Helmet>
                {sections.map(({ color, id, contents }) => (
                    <div key={id} id={id} className={styles.contentContainer} style={{ background: color }}>
                        {contents}
                    </div>
                ))}
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
