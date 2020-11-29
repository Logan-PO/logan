import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid, ListItem, ListItemText } from '@material-ui/core';
import { getSectionSelectors } from '@logan/fe-shared/store/schedule';
import { printSectionTimes } from '@logan/fe-shared/utils/scheduling-utils';
import { CourseLabel } from '../shared/displays';

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
            <ListItemText
                secondary={
                    <React.Fragment>
                        <b>{title}: </b>
                        {value}
                    </React.Fragment>
                }
            />
        );
    }

    render() {
        const section = _.get(this.state, 'section.title');
        const location = _.get(this.state, 'section.location');
        const instructor = _.get(this.state, 'section.instructor');

        return (
            <div className="list-cell">
                <ListItem dense button onClick={() => this.setState({ condensed: !this.state.condensed })}>
                    <Grid container direction="row" alignItems="flex-start">
                        <Grid item style={{ minWidth: '9rem' }}>
                            <ListItemText primary={printSectionTimes(this.state.section)} />
                        </Grid>
                        <Grid item>
                            <ListItemText primary={<CourseLabel cid={_.get(this.state, 'section.cid')} />} />
                            {this.state.condensed && section && this.makeDetailText('Section', section)}
                            {this.state.condensed && location && this.makeDetailText('Location', location)}
                            {this.state.condensed && instructor && this.makeDetailText('Instructor', instructor)}
                        </Grid>
                    </Grid>
                </ListItem>
            </div>
        );
    }
}
OverviewSectionCell.propTypes = {
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
