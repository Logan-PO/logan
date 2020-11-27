import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getScheduleSelectors, updateCourse, updateCourseLocal, deleteSection } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import ListItem from '../../shared/list-item';
import { typographyStyles } from '../../shared/typography';
import ColorPicker, { colors } from '../../shared/pickers/color-picker';

class CourseEditor extends Editor {
    constructor(props) {
        super(props, { id: 'cid', entity: 'course', mobile: true });

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        let course;

        if (this.isEditor) {
            course = props.getCourse(props.route.params.cid);
        } else {
            course = {
                title: '',
                tid: props.route.params.tid,
                color: _.sample(colors).color,
            };
        }

        this.state = { course };
    }

    openModal({ message, confirm }) {
        this.setState({
            modalShown: true,
            modalMessage: message,
            modalConfirmation: () => {
                confirm && confirm();
                this.closeModal();
            },
        });
    }

    closeModal() {
        this.setState({
            modalShown: false,
            modalMessage: undefined,
            modalConfirmation: undefined,
        });
    }

    selectEntity(id) {
        return this.props.getCourse(id);
    }

    updateEntityLocal({ id, changes }) {
        this.props.updateCourseLocal({ id, changes });
    }

    updateEntity(course) {
        this.props.updateCourse(course);
    }

    processChange(changes, prop, e) {
        changes[prop] = e;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ListItem
                    leftContent={
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    paddingHorizontal: 0,
                                    flexGrow: 1,
                                    backgroundColor: 'none',
                                    ...typographyStyles.h5,
                                }}
                                mode="flat"
                                label="Title"
                                value={this.state.course.title}
                                onChangeText={this.handleChange.bind(this, 'title')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingVertical: 0 }}
                />
                <ListItem
                    leftContent={
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    paddingHorizontal: 0,
                                    flexGrow: 1,
                                    backgroundColor: 'none',
                                }}
                                mode="flat"
                                label="Nickname"
                                value={this.state.course.nickname}
                                onChangeText={this.handleChange.bind(this, 'nickname')}
                            />
                        </View>
                    }
                    contentStyle={{ paddingTop: 0 }}
                />
                <ColorPicker value={this.state.course.color} onChange={this.handleChange.bind(this, 'color')} />
            </View>
        );
    }
}

CourseEditor.propTypes = {
    route: PropTypes.object,
    getCourse: PropTypes.func,
    updateCourse: PropTypes.func,
    updateCourseLocal: PropTypes.func,
    getSectionsForCourse: PropTypes.func,
    deleteSection: PropTypes.func,
};

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        getCourse: selectors.baseSelectors.courses.selectById,
        getSectionsForCourse: selectors.getSectionsForCourse,
    };
};

const mapDispatchToProps = {
    updateCourse,
    updateCourseLocal,
    deleteSection,
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseEditor);
