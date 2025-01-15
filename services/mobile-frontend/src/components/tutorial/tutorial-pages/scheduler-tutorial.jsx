import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../shared/typography';
import TutorialPage from '../tutorial-page';
import FullImage from '../full-image';
import OverviewTutorial from './overview-tutorial';
import AssignmentTutorial from './assignment-tutorial';

class SchedulerTutorial extends React.Component {
    render() {
        return (
            <TutorialPage
                {...this.props}
                previousTitle="Overview"
                previousPage={OverviewTutorial}
                nextTitle="Assignments"
                nextPage={AssignmentTutorial}
            >
                <Typography variant="h3">Schedule</Typography>
                <FullImage
                    width={1440}
                    height={2677}
                    horizontalPadding={16}
                    source={require('../images/scheduler_screen.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}The Schedule page is where you can manage your terms, classes, and sections. By pressing a
                    term or the + button, you can edit a term. {'\n'}
                </Typography>
                <FullImage
                    width={1440}
                    height={2677}
                    horizontalPadding={16}
                    source={require('../images/term_editor.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}Once in the term editor, you can see a list of courses. Pressing the + button will add either
                    a new course or holiday, which you can then edit.{'\n'}
                </Typography>
                <FullImage
                    width={1440}
                    height={2677}
                    horizontalPadding={16}
                    source={require('../images/course_editor.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}In the course editor, you can change the course name, course nickname, and color. You can also
                    edit and add sections for the course.{'\n'}
                </Typography>
                <FullImage
                    width={1440}
                    height={2677}
                    horizontalPadding={16}
                    source={require('../images/section_editor.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}In the section editor, you can have recurring sections (those appear on the overview page).
                    {'\n'}
                </Typography>
            </TutorialPage>
        );
    }
}

SchedulerTutorial.propTypes = {
    navigation: PropTypes.object,
};

export default SchedulerTutorial;
