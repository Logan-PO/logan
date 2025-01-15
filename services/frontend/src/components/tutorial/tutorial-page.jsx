import React from 'react';
import { Link } from 'gatsby';
import { Container, Typography, Grid } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import image1 from './images/navigation.png';
import image2 from './images/schedule.png';
import image3 from './images/assignments.png';
import image4 from './images/subtasks.png';
import image5 from './images/tasks.png';
import image6 from './images/overview.png';
import styles from './tutorial-page.module.scss';

export default class TutorialPage extends React.Component {
    render() {
        return (
            <Container>
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <Typography variant="h2">Tutorial</Typography>
                        <Typography>This tutorial will help you to understand how to use Logan.</Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <Typography variant="h4">Navigation</Typography>
                        <Typography>
                            Below is the main screen. You can see all of the links to the major pages on the left side
                            of the screen in turquoise.
                        </Typography>
                        <br />
                        <div className={styles.imageContainer}>
                            <img src={image1} className={styles.image} />
                        </div>
                        <br />
                        <Typography>
                            The left side of the screen has the buttons that allow you to navigate between the major
                            pages on Logan. Clicking on overview, tasks, assignments, schedule, or settings will take
                            you to that respective page. Click on the schedule button to navigate to the schedule page.
                        </Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <Typography variant="h4">Schedule Page</Typography>
                        <Typography>
                            Below is the schedule screen. Here is where you create your schedule, classes, sections,
                            holidays, and semesters.
                        </Typography>
                        <br />
                        <div className={styles.imageContainer}>
                            <img src={image2} className={styles.image} />
                        </div>
                        <br />
                        <Typography>
                            First click on the + New term button to create a new term. A new term will appear above the
                            + New term button. Click on the New term to open the editor on the right side of the screen.
                            Give the term a name under the Title on the right side of the screen. Select the starting
                            and ending dates. Next click on + New course to create a new course. Like the term you
                            created, click the New course and fill in the course details in the editor on the right side
                            of the screen. Now click the + New section to create a new section for that course. Click on
                            the New section and fill out the information on the right side of the screen. You have now
                            created a term, class, and section. You can add new terms, courses, holidays, and sections
                            just like this. Now click on the Assignments button on the left side of the screen in
                            turquoise.
                        </Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <Typography variant="h4">Assignments</Typography>
                        <Typography>
                            Below is the assignments screen. You can see all of your assignments here.
                        </Typography>
                        <br />
                        <div className={styles.imageContainer}>
                            <img src={image3} className={styles.image} />
                        </div>
                        <br />
                        <Typography>
                            Click on the orange circle with a plus in it at the bottom of the screen. A popup box will
                            appear. Fill in the information to create a new assignment. Select the course you created to
                            attach this assignment to that course. Once you created the assignment it will appear under
                            the column in the middle of the screen. A toggle at the bottom of the screen next to the
                            orange button allows you to toggle between upcoming and past assignments. The assignment you
                            just created will show under the upcoming assignments so if you hit the toggle now it will
                            disappear. Click on the assignment you just created to see information on that assignment.
                            You can edit that assignment on the right side of the screen
                        </Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <Typography variant="h4">Subtasks</Typography>
                        <Typography>
                            Below is the assignment details screen. You are still on the assignments page but are
                            looking at the details for the currnet assignment.
                        </Typography>
                        <br />
                        <div className={styles.imageContainer}>
                            <img src={image4} className={styles.image} />
                        </div>
                        <br />
                        <Typography>
                            Click on the orange plus button on the right side of the screen near Subtasks. This allows
                            you to create subtasks for an assignment. Subtasks are sub categories of assignments. For
                            example consider an assignment for writing an essay. An example subtask may be to write the
                            introduction. Another subtask may be to revise the essay. Now click on Tasks on the left
                            side of the screen in turquoise.
                        </Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <Typography variant="h4">Tasks</Typography>
                        <Typography>Below is the tasks screen. You can see all of your tasks here.</Typography>
                        <br />
                        <div className={styles.imageContainer}>
                            <img src={image5} className={styles.image} />
                        </div>
                        <br />
                        <Typography>
                            The tasks page is just like the assignments page except for tasks. You can create a task
                            just like you would an assignment. By clicking on a task you can see and edit the details on
                            the right side of the screen. When you are done, click on Overview on the left side of the
                            screen in turquoise.
                        </Typography>
                    </Grid>
                    <br />
                    <Grid item xs={12}>
                        <Typography variant="h4">Overview</Typography>
                        <Typography>
                            Below is the overview screen. This is a standard calendar view which allows you to see your
                            schedule.
                        </Typography>
                        <br />
                        <div className={styles.imageContainer}>
                            <img src={image6} className={styles.image} />
                        </div>
                        <br />
                        <Typography>
                            On the top/middle of the screen you can toggle between a week and month view. On the
                            top/right of the screen you can toggle between last and next week or last and next month.
                            The top center of the screen tells you what time period you are looking at. In this case it
                            says This Week because the current view is the current week. The left side of the overview
                            page shows your schedule in list format for the upcoming days. This covers the basics of
                            Logan. Click the link below to return to the login screen.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <br />
                        <Link to="/">
                            Back to home <ExitToAppIcon fontSize="small" />
                        </Link>
                        <br />
                        <br />
                        <br />
                    </Grid>
                </Grid>
            </Container>
        );
    }
}
