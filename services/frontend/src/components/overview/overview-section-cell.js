import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { navigate } from 'gatsby';
import { dateUtils } from '@logan/core';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import { CourseLabel } from '../shared/displays';
import { getSectionSelectors, setShouldGoTo } from '../../store/schedule';

const {
    dayjs,
    constants: { DB_TIME_FORMAT },
} = dateUtils;

export class OverviewSectionCell extends React.Component {
    constructor(props) {
        super(props);

        this.getTimingString = this.getTimingString.bind(this);
        this.openSection = this.openSection.bind(this);

        this.state = {
            section: this.props.selectSectionFromStore(this.props.sid),
        };
    }

    getTimingString() {
        const startTime = dayjs(this.state.section.startTime, DB_TIME_FORMAT);
        const endTime = dayjs(this.state.section.endTime, DB_TIME_FORMAT);

        if (startTime.format('a') === endTime.format('a')) {
            return `${startTime.format('h:mm')} - ${endTime.format('h:mm A')}`;
        } else {
            return `${startTime.format('h:mm A')} - ${endTime.format('h:mm A')}`;
        }
    }
    determineRendering() {
        if (this.props.condensed) {
            return (
                <Grid container direction="row" alignItems="top">
                    <Grid item style={{ minWidth: '11rem' }}>
                        <ListItemText primary={this.getTimingString()} />
                    </Grid>
                    <Grid item>
                        <ListItemText primary={<CourseLabel cid={_.get(this.state, 'section.cid')} />} />
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <Grid container direction="row" alignItems="top">
                    <Grid item style={{ minWidth: '11rem' }}>
                        <ListItemText primary={this.getTimingString()} />
                        <ListItemText primary={_.get(this.state, 'section.location')} />
                    </Grid>
                    <Grid item>
                        <ListItemText primary={<CourseLabel cid={_.get(this.state, 'section.cid')} />} />
                        <Grid container direction="row" alignItems="top">
                            <ListItemText primary={_.get(this.state, 'section.instructor')} />{' '}
                        </Grid>
                    </Grid>
                </Grid>
            );
        }
    }

    openSection() {
        this.props.setShouldGoTo({ type: 'section', eid: this.state.section.sid });
        navigate('/schedule');
    }

    render() {
        return (
            <div className="list-cell">
                <ListItem dense button onClick={this.openSection}>
                    {this.determineRendering()}
                </ListItem>
            </div>
        );
    }
}
OverviewSectionCell.propTypes = {
    condensed: PropTypes.boolean,
    sid: PropTypes.string,
    cid: PropTypes.string,
    tid: PropTypes.string,
    selectSectionFromStore: PropTypes.func,
    setShouldGoTo: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectSectionFromStore: getSectionSelectors(state.schedule).selectById,
    };
};

export default connect(mapStateToProps, { setShouldGoTo })(OverviewSectionCell);
