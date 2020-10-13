import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getAssignmentsSelectors, updateAssignment, updateAssignmentLocal } from '../../store/assignments';
import style from './assignment-cell.module.scss';

export class AssignmentCell extends React.Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            assignment: this.props.selectAssignmentFromStore(this.props.aid),
        };
    }

    select() {
        this.props.onSelect(this.props.aid);
    }

    componentDidUpdate(prevProps) {
        if (this.props.aid !== prevProps.aid) {
            this.setState({
                assignment: this.props.selectAssignmentFromStore(this.props.aid),
            });
        }
    }

    handleChange() {
        const changes = {
            color: 'red',
        };

        this.props.updateAssignmentLocal({
            id: this.props.aid,
            changes,
        });

        this.setState({
            assignment: _.merge({}, this.state.assignment, changes),
        });
    }

    render() {
        console.log('Ass: ', this);

        return (
            <div
                className={classNames(style.assignmentCell, { [style.selected]: this.props.selected })}
                onClick={this.select}
            >
                <span>{_.get(this.state, 'assignment.name')}</span>
                {!_.isEmpty(_.get(this.state, 'assignment.desc')) && (
                    <React.Fragment>
                        <br />
                        <span style={{ color: 'gray' }}>
                            {this.state.assignment.name}
                            {this.state.assignment.desc}
                        </span>
                    </React.Fragment>
                )}
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
};

const mapStateToProps = state => {
    return {
        selectAssignmentFromStore: getAssignmentsSelectors(state.assignments).selectById,
    };
};

const mapDispatchToProps = { updateAssignment, updateAssignmentLocal };

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentCell);
