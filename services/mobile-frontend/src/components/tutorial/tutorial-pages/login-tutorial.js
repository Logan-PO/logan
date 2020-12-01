import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../shared/typography';
import FullImage from '../full-image';
import TutorialPage from '../tutorial-page';
import OverviewTutorial from './overview-tutorial';

class LoginTutorial extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TutorialPage
                onPageChange={this.props.onPageChange}
                previousTitle="Back"
                nextTitle="The Overview Page"
                nextPage={OverviewTutorial}
            >
                <Typography variant="h3" style={{ marginBottom: 16 }}>
                    Login
                </Typography>
                <FullImage
                    width={1440}
                    height={2642}
                    horizontalPadding={16}
                    source={require('../images/login_screen.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}To login with Logan, just press the login button, and follow the on-screen instructions. If
                    you are a new user, input your name, desired username, and email in the create user page (see
                    below). Once completed, you should be taken to the Overview page. {'\n'}
                </Typography>
                <FullImage
                    width={1440}
                    height={2701}
                    horizontalPadding={16}
                    source={require('../images/create_account.jpg')}
                />
            </TutorialPage>
        );
    }
}

LoginTutorial.propTypes = {
    navigation: PropTypes.object,
    onPageChange: PropTypes.func,
};

export default LoginTutorial;
