import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { Helmet } from 'react-helmet';
import { Toolbar } from '@material-ui/core';
import { LOGIN_STAGE, fetchSelf } from '@logan/fe-shared/store/login';
import styles from './page.module.scss';
import { Navbar, Sidebar } from '.';

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.loginStage === LOGIN_STAGE.DONE && !this.props.currentUser) {
            this.props.fetchSelf();
        } else if (this.props.loginStage !== LOGIN_STAGE.DONE) {
            navigate('/');
        }
    }

    render() {
        return (
            <div className={styles.page}>
                <Helmet>
                    <title>Logan | {this.props.title}</title>
                </Helmet>
                <Navbar title={this.props.title} buttons={this.props.buttons} />
                <div className={styles.rootContainer}>
                    <Toolbar />
                    <div className={styles.contentContainer}>
                        <Sidebar currentPage={this.props.title} />
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
};

const mapStateToProps = state => ({
    loginStage: state.login.currentStage,
    currentUser: state.login.user,
});

const mapDispatchToProps = {
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
