import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { getSectionSelectors } from 'packages/fe-shared/store/schedule';
import { printSectionTimes } from 'packages/fe-shared/utils/scheduling-utils';
import { CourseLabel } from '../shared/displays';
import Typography from '../shared/typography';
import styles from './overview-section-cell.module.scss';

class OverviewSectionCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            section: this.props.selectSectionFromStore(this.props.sid),
            condensed: false,
        };
    }

    makeDetailText(title, value) {
        return (
            <Typography variant="body2" color="textSecondary">
                <b>{title}:&nbsp;</b>
                {value}
            </Typography>
        );
    }

    render() {
        const { className } = this.props;
        const { section = {}, condensed = false } = this.state;
        const { title, location, instructor, cid } = section;

        return (
            <div
                className={clsx('list-cell', styles.cell, className)}
                onClick={() => this.setState({ condensed: !condensed })}
            >
                <div className={styles.sectionTime}>
                    <Typography>{printSectionTimes(section)}</Typography>
                </div>
                <div className={styles.details}>
                    <Typography>{<CourseLabel cid={cid} />}</Typography>
                    {condensed && title && this.makeDetailText('Section', title)}
                    {condensed && location && this.makeDetailText('Location', location)}
                    {condensed && instructor && this.makeDetailText('Instructor', instructor)}
                </div>
            </div>
        );
    }
}
OverviewSectionCell.propTypes = {
    className: PropTypes.string,
    sid: PropTypes.string,
    cid: PropTypes.string,
    tid: PropTypes.string,
    selectSectionFromStore: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectSectionFromStore: getSectionSelectors(state.schedule).selectById,
    };
};

export default connect(mapStateToProps, null)(OverviewSectionCell);
