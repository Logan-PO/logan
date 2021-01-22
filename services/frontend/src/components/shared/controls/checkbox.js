import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import CheckIcon from '@material-ui/icons/CheckRounded';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import styles from './checkbox.module.scss';

class Checkbox extends React.Component {
    _onChange() {
        if (this.props.onChange) {
            this.props.onChange({
                target: {
                    value: !this.props.checked,
                },
            });
        }
    }

    render() {
        let checkboxClass = styles.checkbox;
        const checkboxStyle = {};

        const course = this.props.selectCourse(this.props.cid);

        if (this.props.size === 'large') {
            checkboxClass += ` ${styles.large}`;
        }

        if (this.props.checked) {
            checkboxClass += ` ${styles.checked}`;
            if (course) checkboxStyle.color = `${course.color}`;
        }

        if (this.props.marginRight !== undefined) {
            checkboxStyle.marginRight = this.props.marginRight;
        }

        return (
            <ButtonBase
                className={clsx(checkboxClass, this.props.className)}
                disabled={this.props.disabled}
                style={checkboxStyle}
                onClick={this._onChange.bind(this)}
            >
                <CheckIcon className={styles.checkIcon} />
            </ButtonBase>
        );
    }
}

Checkbox.propTypes = {
    className: PropTypes.string,
    size: PropTypes.string,
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
