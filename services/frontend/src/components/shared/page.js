import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Helmet } from 'react-helmet';
import api from '@logan/fe-shared/utils/api';
import { setLoginStage, LOGIN_STAGE, fetchSelf } from '@logan/fe-shared/store/login';
import { getCurrentTheme } from '../../globals/theme';
import styles from './page.module.scss';
import { Navbar, Sidebar } from '.';

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        if (this.props.loginStage === LOGIN_STAGE.DONE && !this.props.currentUser) {
            this.props.fetchSelf();
        } else if (this.props.loginStage !== LOGIN_STAGE.DONE) {
            if (await api.hasStashedBearer()) {
                this.props.setLoginStage(LOGIN_STAGE.DONE);
            } else {
                navigate('/');
            }
        }
    }

    render() {
        const theme = getCurrentTheme();

        // Insert theme colors as CSS variables into the page wrapper's style, so they can be used by its children
        const cssVariables = {
            '--color-primary': theme.palette.primary.main,
            '--color-primary-light': theme.palette.primary.light,
            '--color-primary-dark': theme.palette.primary.dark,
            '--color-primary-contrast-text': theme.palette.primary.contrastText,
            '--color-secondary': theme.palette.secondary.main,
            '--color-secondary-light': theme.palette.secondary.light,
            '--color-secondary-dark': theme.palette.secondary.dark,
            '--color-secondary-contrast-text': theme.palette.secondary.contrastText,
            '--color-error': theme.palette.error.main,
            '--color-error-light': theme.palette.error.light,
            '--color-error-dark': theme.palette.error.dark,
            '--color-error-contrast-text': theme.palette.error.contrastText,
            '--color-warning': theme.palette.warning.main,
            '--color-warning-light': theme.palette.warning.light,
            '--color-warning-dark': theme.palette.warning.dark,
            '--color-warning-contrast-text': theme.palette.warning.contrastText,
            '--text-primary': theme.palette.text.primary,
            '--text-secondary': theme.palette.text.secondary,
            '--background-paper': theme.palette.background.paper,
            '--background-default': theme.palette.background.default,
        };

        return (
            <div className={styles.page} style={cssVariables}>
                <Helmet>
                    <title>Logan / {this.props.title}</title>
                </Helmet>
                <Sidebar currentPage={this.props.title} />
                <div className={styles.rootContainer}>
                    <div className={styles.contentContainer}>
                        <Navbar title={this.props.title} buttons={this.props.buttons} />
                        <div className={styles.content}>{this.props.children}</div>
                    </div>
                </div>
            </div>
        );
    }
}

Page.propTypes = {
    title: PropTypes.string,
    buttons: PropTypes.array,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    loginStage: PropTypes.string,
    currentUser: PropTypes.object,
    fetchSelf: PropTypes.func,
    setLoginStage: PropTypes.func,
};

const mapStateToProps = state => ({
    loginStage: state.login.currentStage,
    currentUser: state.login.user,
});

const mapDispatchToProps = {
    fetchSelf,
    setLoginStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
