import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '../shared/typography';
import styles from './assignment-cell.module.scss';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from 'packages/fe-shared/store/assignments';
import { noProp } from 'packages/fe-shared/utils/misc';

class AssignmentCell extends React.Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.deleted = this.deleted.bind(this);
        this.state = {
            assignment: this.props.selectAssignmentFromStore(this.props.aid),
        };
    }

    select() {
        if (this.props.onSelect) this.props.onSelect(this.props.aid);
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
        const { selected, className } = this.props;
        const { assignment = {} } = this.state;

        return (
            <div
                className={clsx('list-cell', styles.cell, className, selected && styles.selected)}
                onClick={this.select}
            >
                <div className={styles.content}>
                    <Typography>{assignment.title}</Typography>
                    {assignment.description && (
                        <Typography variant="body2" color="textSecondary">
                            {assignment.description}
                        </Typography>
                    )}
                </div>
                <div className={styles.rightContent}>
                    <div className={styles.actionsPriorityWrapper}>
                        <div className="actions">
                            {this.props.onDelete && (
                                <Tooltip title="Delete">
                                    <IconButton size="small" className={styles.action} onClick={noProp(this.deleted)}>
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
AssignmentCell.propTypes = {
    className: PropTypes.string,
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
