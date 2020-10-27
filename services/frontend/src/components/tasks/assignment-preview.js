import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, CardActionArea, CardContent, Typography, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { getAssignmentsSelectors } from '../../store/assignments';
import CourseLabel from '../shared/course-label';
import classes from './assignment-preview.module.scss';

class AssignmentPreview extends React.Component {
    render() {
        const assignment = this.props.getAssignment(this.props.aid);

        return (
            <React.Fragment>
                <Typography variant="overline">
                    <b>Related Assignment</b>
                </Typography>
                <Card variant="outlined">
                    <CardActionArea>
                        <CardContent className={classes.contentContainer}>
                            <div className={classes.details}>
                                {assignment.cid && (
                                    <div className="cell-upper-label">
                                        <CourseLabel cid={assignment.cid} />
                                    </div>
                                )}
                                <Typography>{assignment.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Due {assignment.dueDate}
                                </Typography>
                            </div>
                            <IconButton disableRipple>
                                <ExitToAppIcon />
                            </IconButton>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </React.Fragment>
        );
    }
}

AssignmentPreview.propTypes = {
    aid: PropTypes.string,
    getAssignment: PropTypes.func,
};

const mapStateToProps = state => ({
    getAssignment: getAssignmentsSelectors(state.assignments).selectById,
});

export default connect(mapStateToProps, null)(AssignmentPreview);
