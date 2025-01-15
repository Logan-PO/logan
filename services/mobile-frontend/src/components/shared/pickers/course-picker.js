import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { getScheduleSelectors } from 'packages/fe-shared/store/schedule';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewController from '../view-controller';
import ListHeader from '../list-header';
import ListItem from '../list-item';
import Typography from '../typography';

class CoursePicker extends React.Component {
    constructor(props) {
        super(props);

        this.selectCourse = this.selectCourse.bind(this);

        this.state = {
            selectedCid: _.get(this.props.route, 'params.cid'),
        };
    }

    selectCourse(cid) {
        this.setState({ selectedCid: cid });

        const onSelect = _.get(this.props.route, 'params.onSelect');

        if (onSelect) onSelect(cid);

        this.props.navigation.goBack();
    }

    iconToDisplay(course) {
        const color = this.state.selectedCid === course.cid ? course.color : 'rgba(0, 0, 0, 0)';

        return <Icon name="check" style={{ alignSelf: 'center', marginRight: 12 }} size={18} color={color} />;
    }

    generateItems() {
        const terms = this.props.tids.map(tid => {
            const term = { ...this.props.getTerm(tid) };
            term.courses = this.props.getCoursesForTerm(term);
            return term;
        });

        const sections = [];
        sections.push(
            <List.Section key="none">
                <ListItem
                    key="none"
                    leftContent={
                        <View style={{ flexDirection: 'row' }}>
                            {this.iconToDisplay({ color: 'black' })}
                            <Typography>None</Typography>
                        </View>
                    }
                    onPress={this.selectCourse.bind(this, undefined)}
                />
            </List.Section>
        );

        for (const term of terms.filter(term => term.courses.length)) {
            const items = [];

            for (const course of term.courses) {
                items.push(
                    <ListItem
                        key={course.cid}
                        leftContent={
                            <View style={{ flexDirection: 'row' }}>
                                {this.iconToDisplay(course)}
                                <Typography style={{ fontWeight: 'bold' }} color={course.color}>
                                    {course.nickname || course.title}
                                </Typography>
                            </View>
                        }
                        onPress={this.selectCourse.bind(this, course.cid)}
                    />
                );
            }

            sections.push(
                <List.Section key={sections.length}>
                    <ListHeader key={term.tid}>{term.title}</ListHeader>
                    {items}
                </List.Section>
            );
        }

        return sections;
    }

    render() {
        return (
            <ViewController title="Select Course" navigation={this.props.navigation} route={this.props.route}>
                <ScrollView>
                    <View style={{ backgroundColor: 'white' }}>{this.generateItems()}</View>
                </ScrollView>
            </ViewController>
        );
    }
}

CoursePicker.propTypes = {
    route: PropTypes.object,
    navigation: PropTypes.object,
    tids: PropTypes.array,
    getTerm: PropTypes.func,
    getCoursesForTerm: PropTypes.func,
    allCids: PropTypes.array,
};

CoursePicker.defaultProps = {
    tids: [],
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        tids: selectors.baseSelectors.terms.selectIds(),
        getTerm: selectors.baseSelectors.terms.selectById,
        getCoursesForTerm: selectors.getCoursesForTerm,
        allCids: selectors.baseSelectors.courses.selectIds(),
    };
};

export default connect(mapStateToProps, null)(CoursePicker);
