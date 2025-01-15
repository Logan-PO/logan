import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Helmet } from 'react-helmet';
import { getCurrentTheme } from '../../globals/theme';
import styles from './page.module.scss';
import { Navbar, Sidebar } from '.';
import { setLoginStage, LOGIN_STAGE, fetchSelf } from 'packages/fe-shared/store/login';
import api from 'packages/fe-shared/utils/api';

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

        return (
            <div className={styles.page} style={{ background: theme.palette.primary.main }}>
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
