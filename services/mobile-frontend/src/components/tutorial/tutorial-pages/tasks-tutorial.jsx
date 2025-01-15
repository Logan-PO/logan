import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../shared/typography';
import TutorialPage from '../tutorial-page';
import FullImage from '../full-image';
import AssignmentTutorial from './assignment-tutorial';

class TasksTutorial extends React.Component {
    render() {
        return (
            <TutorialPage
                {...this.props}
                previousTitle="Assignments"
                previousPage={AssignmentTutorial}
                nextTitle="Done"
            >
                <Typography variant="h3">Tasks</Typography>
                <FullImage
                    width={1440}
                    height={2642}
                    horizontalPadding={16}
                    source={require('../images/task_overview.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}The tasks page displays tasks. Toggling the bar at the top changes the display from upcoming
                    tasks to completed tasks. Pressing the box next to a task marks that task as completed. Swiping left
                    on a task opens up an option to delete that task, or, if the task is overdue, to change the task
                    due-date to today. Clicking the + button or an existing tasks brings up the task editor.{'\n'}
                </Typography>
                <FullImage
                    width={1440}
                    height={2642}
                    horizontalPadding={16}
                    source={require('../images/task_editor.jpg')}
                />
                <Typography style={{ textAlign: 'center' }} variant="body">
                    {'\n'}In the task editor, you can change the title, add a description, set a due date, associate
                    with a course, or set the priority of this task.{'\n'}
                </Typography>
            </TutorialPage>
        );
    }
}

TasksTutorial.propTypes = {
    navigation: PropTypes.object,
};

export default TasksTutorial;
