import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { getScheduleSelectors } from '@logan/fe-shared/store/schedule';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

        return <Icon name="check" style={{ alignSelf: 'center' }} size={18} color={color} />;
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
                <List.Item
                    key="none"
                    title="None"
                    onPress={this.selectCourse.bind(this, undefined)}
                    left={style => this.iconToDisplay({ color: 'black' }, style)}
                />
            </List.Section>
        );

        for (const term of terms.filter(term => term.courses.length)) {
            const items = [];

            for (const course of term.courses) {
                const itemStyle = {
                    color: course.color,
                };

                items.push(
                    <List.Item
                        key={course.cid}
                        title={course.nickname || course.title}
                        titleStyle={itemStyle}
                        left={style => this.iconToDisplay(course, style)}
                        onPress={this.selectCourse.bind(this, course.cid)}
                    />
                );
            }

            sections.push(
                <List.Section key={sections.length}>
                    <List.Subheader key={term.tid}>{term.title}</List.Subheader>
                    {items}
                </List.Section>
            );
        }

        return sections;
    }

    render() {
        return (
            <ScrollView>
                <View style={{ backgroundColor: 'white' }}>{this.generateItems()}</View>
            </ScrollView>
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
