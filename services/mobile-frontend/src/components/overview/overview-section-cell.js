import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getSectionSelectors } from '@logan/fe-shared/store/schedule';
import { View } from 'react-native';
import CourseLabel from '../shared/displays/course-label';
import ListItem from '../shared/list-item';
import Typography from '../shared/typography';
import { printSectionTimes } from './scheduling-utils';

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
            <React.Fragment>
                <b>{title}: </b>
                {value}
            </React.Fragment>
        );
    }

    render() {
        const section = _.get(this.state, 'section.title');
        const location = _.get(this.state, 'section.location');
        const instructor = _.get(this.state, 'section.instructor');

        return (
            <View>
                <ListItem
                    leftContent={
                        <View container direction="row" alignItems="flex-start">
                            <View item style={{ minWidth: '9rem' }}>
                                <Typography primary={printSectionTimes(this.state.section)} />
                            </View>
                            <View item>
                                <Typography primary={<CourseLabel cid={_.get(this.state, 'section.cid')} />} />
                                {this.state.condensed && section && this.makeDetailText('Section', section)}
                                {this.state.condensed && location && this.makeDetailText('Location', location)}
                                {this.state.condensed && instructor && this.makeDetailText('Instructor', instructor)}
                            </View>
                        </View>
                    }
                    onClick={() => this.setState({ condensed: !this.state.condensed })}
                />
            </View>
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
