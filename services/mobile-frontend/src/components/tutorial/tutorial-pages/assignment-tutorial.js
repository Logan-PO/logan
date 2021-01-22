import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../shared/typography';
import TutorialPage from '../tutorial-page';
import FullImage from '../full-image';
import SchedulerTutorial from './scheduler-tutorial';
import TasksTutorial from './tasks-tutorial';

class AssignmentTutorial extends React.Component {
    render() {
        return (
            <TutorialPage
                {...this.props}
                previousTitle="Schedule"
                previousPage={SchedulerTutorial}
                nextTitle="Tasks"
                nextPage={TasksTutorial}
            >
                <Typography variant="h3">Assignments</Typography>
                <FullImage
                    width={1440}
                    height={2677}
                    horizontalPadding={16}
                    source={require('../images/assignment_overview.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}You can find all your assignments on this screen. Toggling the past-upcoming bar at the top of
                    the screen switches from displaying previous assignments and future assignments. Pressing on an
                    existing assignment or hitting the + button brings up the assignment editor. Swiping on an
                    assignment to the left opens an option to delete that assignment.
                    {'\n'}
                </Typography>
                <FullImage
                    width={1440}
                    height={2677}
                    horizontalPadding={16}
                    source={require('../images/assignment_editor.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}In the assignment editor, you can change the name of an assignment, its description, give it a
                    due date, and associate it with a course. You can add tasks associated with this assignment, which
                    are displayed on screen. Reminders can also be added to assignments.
                    {'\n'}
                </Typography>
            </TutorialPage>
        );
    }
}

AssignmentTutorial.propTypes = {
    navigation: PropTypes.object,
};

export default AssignmentTutorial;
