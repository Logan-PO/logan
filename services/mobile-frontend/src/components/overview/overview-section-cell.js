import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
        return (
            <ListItem
                leftContent={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 2 }}>
                            <Typography variant="body2">{printSectionTimes(this.state.section)}</Typography>
                        </View>
                        <View style={{ flex: 3 }}>
                            <CourseLabel cid={_.get(this.state, 'section.cid')} />
                        </View>
                    </View>
                }
                contentStyle={{ minHeight: 0, paddingVertical: 10 }}
                onClick={() => this.setState({ condensed: !this.state.condensed })}
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
