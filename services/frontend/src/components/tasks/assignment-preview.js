import React from 'react';
import { connect } from 'react-redux';
import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { dateUtils } from '@logan/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import { getAssignmentsSelectors, setShouldGoToAssignment } from '@logan/fe-shared/store/assignments';
import InputGroup from '../shared/controls/input-group';
import Typography from '../shared/typography';
import classes from './assignment-preview.module.scss';

class AssignmentPreview extends React.Component {
    openAssignment() {
        this.props.setShouldGoToAssignment(this.props.aid);
        navigate('/assignments');
    }

    render() {
        const assignment = this.props.getAssignment(this.props.aid);
        const formattedDueDate = dateUtils.readableDueDate(assignment.dueDate);

        return (
            <InputGroup
                label="Related Assignment"
                icon={AssignmentIcon}
                content={
                    <div className={classes.contentContainer}>
                        <div className={classes.details}>
                            <Typography component="span" style={{ fontWeight: 500 }}>
                                {assignment.title}
                            </Typography>
                            &nbsp;
                            <Typography component="span" color="textSecondary">
                                {` / Due ${formattedDueDate}`}
                            </Typography>
                        </div>
                        <IconButton
                            size="small"
                            style={{ marginLeft: 3, color: 'black' }}
                            onClick={this.openAssignment.bind(this)}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </div>
                }
            />
        );
    }
}

AssignmentPreview.propTypes = {
    aid: PropTypes.string,
    getAssignment: PropTypes.func,
    setShouldGoToAssignment: PropTypes.func,
};

const mapStateToProps = state => ({
    getAssignment: getAssignmentsSelectors(state.assignments).selectById,
});

export default connect(mapStateToProps, { setShouldGoToAssignment })(AssignmentPreview);
