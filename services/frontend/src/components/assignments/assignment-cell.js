import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '../../store/assignments';
import styles from './assignment-cell.module.scss';

export class AssignmentCell extends React.Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.deleted = this.deleted.bind(this);
        this.state = {
            assignment: this.props.selectAssignmentFromStore(this.props.aid),
        };
    }

    select() {
        this.props.onSelect(this.props.aid);
    }

    deleted() {
        this.props.onDelete(this.state.assignment);
    }

    componentDidUpdate() {
        const storeAssignment = this.props.selectAssignmentFromStore(this.props.aid);

        if (!_.isEqual(storeAssignment, this.state.assignment)) {
            this.setState({ assignment: storeAssignment });
        }
    }

    render() {
        return (
            <div className={styles.assignmentCell}>
                <ListItem button selected={this.props.selected} onClick={this.select}>
                    <ListItemIcon>{_.get(this.state, 'assignment.cid', ['N/A'])}</ListItemIcon>
                    <ListItemText
                        primary={_.get(this.state, 'assignment.title')}
                        secondary={_.get(this.state, 'assignment.description')}
                    />
                    <ListItemSecondaryAction className={styles.actions}>
                        <IconButton edge="end" onClick={this.deleted}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </div>
        );
    }
}
AssignmentCell.propTypes = {
    aid: PropTypes.string,
    updateAssignmentLocal: PropTypes.func,
    selectAssignmentFromStore: PropTypes.func,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectAssignmentFromStore: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateAssignment, updateAssignmentLocal };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCell);
