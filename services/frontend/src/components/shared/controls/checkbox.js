import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox as MuiCheckbox } from '@material-ui/core';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';

class Checkbox extends React.Component {
    render() {
        const checkboxStyle = { padding: 0 };
        const course = this.props.selectCourse(this.props.cid);

        if (this.props.color) {
            checkboxStyle.color = this.props.color;
        }
        if (course && this.props.checked) {
            checkboxStyle.color = course.color;
        }

        if (this.props.marginRight !== undefined) {
            checkboxStyle.marginRight = this.props.marginRight;
        }

        return (
            <MuiCheckbox
                disabled={this.props.disabled}
                checked={this.props.checked}
                onChange={this.props.onChange}
                style={checkboxStyle}
            />
        );
    }
}

Checkbox.propTypes = {
    color: PropTypes.string,
    cid: PropTypes.string,
    selectCourse: PropTypes.func,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    marginRight: PropTypes.any,
};

const mapStateToProps = state => ({
    selectCourse: getScheduleSelectors(state.schedule).baseSelectors.courses.selectById,
});

export default connect(mapStateToProps, null)(Checkbox);
