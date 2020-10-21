import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Container, Typography, Grid, Divider } from '@material-ui/core';
import { LOGIN_STAGE, setLoginStage, fetchSelf } from '../../store/login';
import GoogleBtn from './GoogleButton';
import styles from './home-page.module.scss';

class HomePage extends React.Component {
    async componentDidUpdate() {
        if (this.props.loginStage === LOGIN_STAGE.LOGGED_IN) {
            await this.props.fetchSelf();
            this.props.setLoginStage(LOGIN_STAGE.DONE);
            navigate('/tasks');
        }
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
                    </Grid>
                </Grid>
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
