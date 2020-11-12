import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { Container, Typography, Grid } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from '@logan/fe-shared/store/login';
import GoogleBtn from './GoogleButton';
import SignUpForm from './signup-form';
import styles from './home-page.module.scss';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.modalClosed = this.modalClosed.bind(this);

        this.state = {
            createModalOpen: false,
        };
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

    modalClosed() {
        this.setState({ createModalOpen: false });
    }

    render() {
        return (
            <Container className={styles.homePage}>
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <Typography variant="h2">Logan</Typography>
                        <Typography>
                            Logan is an intelligent personal organizer, designed with college students in mind.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4">Features</Typography>
                        <Typography>Feature info here</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <br />
                    </Grid>
                    <Grid item xs={12}>
                        <GoogleBtn />
                        {this.props.loginStage === LOGIN_STAGE.DONE && (
                            <React.Fragment>
                                <br />
                                <br />
                                <Link to="/tasks">
                                    Open Logan <ExitToAppIcon fontSize="small" />
                                </Link>
                            </React.Fragment>
                        )}
                    </Grid>
                </Grid>
                <SignUpForm open={this.state.createModalOpen} onClose={this.modalClosed} />
            </Container>
        );
    }
}

HomePage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
