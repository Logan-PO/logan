import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../shared/typography';
import TutorialPage from '../tutorial-page';
import FullImage from '../full-image';
import LoginTutorial from './login-tutorial';
import SchedulerTutorial from './scheduler-tutorial';

class OverviewTutorial extends React.Component {
    render() {
        return (
            <TutorialPage
                {...this.props}
                previousTitle="Login"
                previousPage={LoginTutorial}
                nextTitle="Your Schedule"
                nextPage={SchedulerTutorial}
            >
                <Typography variant="h3" style={{ marginBottom: 16 }}>
                    Overview
                </Typography>
                <FullImage
                    width={1440}
                    height={2677}
                    horizontalPadding={16}
                    source={require('../images/overview.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}The overview page shows all classes, assignments and tasks in one convenient place. The page
                    is read only, as the other screens are where you can edit your schedule. {'\n'}
                </Typography>
            </TutorialPage>
        );
    }
}

OverviewTutorial.propTypes = {
    navigation: PropTypes.object,
};

export default OverviewTutorial;
