import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSectionSelectors } from 'packages/fe-shared/store/schedule';
import { View, LayoutAnimation } from 'react-native';
import SyncComponent from 'packages/fe-shared/components/sync-component';
import CourseLabel from '../shared/displays/course-label';
import ListItem from '../shared/list-item';
import Typography from '../shared/typography';
import { printSectionTimes } from './scheduling-utils';

class OverviewSectionCell extends SyncComponent {
    constructor(props) {
        super(props);

        this.toggleCondensed = this.toggleCondensed.bind(this);

        this.state = {
            section: this.props.selectSectionFromStore(this.props.sid),
            condensed: true,
        };
    }

    async toggleCondensed() {
        const duration = 100;

        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
        );

        await this.setStateSync({ condensed: !this.state.condensed });

        return new Promise(resolve => setTimeout(resolve, duration));
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
            <ListItem
                leftContent={
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <View style={{ flex: 2 }}>
                            <Typography variant="body2">{printSectionTimes(this.state.section)}</Typography>
                        </View>
                        <View style={{ flex: 3 }}>
                            <CourseLabel cid={_.get(this.state, 'section.cid')} />
                            {!this.state.condensed && (
                                <React.Fragment>
                                    {!_.isEmpty(section) && (
                                        <Typography variant="body2" color="detail">
                                            Title: {section}
                                        </Typography>
                                    )}
                                    {!_.isEmpty(location) && (
                                        <Typography variant="body2" color="detail">
                                            Location: {location}
                                        </Typography>
                                    )}
                                    {!_.isEmpty(instructor) && (
                                        <Typography variant="body2" color="detail">
                                            Instructor: {instructor}
                                        </Typography>
                                    )}
                                </React.Fragment>
                            )}
                        </View>
                    </View>
                }
                contentStyle={{ minHeight: 0, paddingVertical: 10 }}
                onPress={this.toggleCondensed}
            />
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
