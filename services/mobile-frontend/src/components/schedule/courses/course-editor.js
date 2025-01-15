import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper';
import ListItem from '../../shared/list-item';
import Typography, { typographyStyles } from '../../shared/typography';
import ColorPicker, { colors } from '../../shared/pickers/color-picker';
import SectionCell from '../sections/section-cell';
import ListHeader from '../../shared/list-header';
import Editor from 'packages/fe-shared/components/editor';
import {
    getScheduleSelectors,
    updateCourse,
    updateCourseLocal,
    deleteSection,
} from 'packages/fe-shared/store/schedule';

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

    sectionsList() {
        const sections = this.props.getSectionsForCourse(this.state.course);

        return (
            <React.Fragment>
                {sections.length ? (
                    sections.map(section => (
                        <SectionCell
                            key={section.sid}
                            section={section}
                            onPress={() =>
                                this.props.navigation.push('Section', {
                                    tid: this.state.course.tid,
                                    cid: this.state.course.cid,
                                    sid: section.sid,
                                })
                            }
                            onDeletePressed={() =>
                                this.openModal({
                                    message: 'You are about to delete a section.\nThis cannot be undone.',
                                    confirm: () => this.props.deleteSection(section),
                                })
                            }
                        />
                    ))
                ) : (
                    <ListItem
                        key="none"
                        leftContent={
                            <Typography color="secondary" style={{ fontStyle: 'italic' }}>
                                None
                            </Typography>
                        }
                    />
                )}
            </React.Fragment>
        );
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
                {this.isEditor && (
                    <React.Fragment>
                        <ListHeader style={{ marginTop: 8 }}>Sections</ListHeader>
                        {this.sectionsList()}
                    </React.Fragment>
                )}
                <Portal>
                    <Dialog visible={this.state.modalShown} onDismiss={this.closeModal}>
                        <Dialog.Title>Are you sure?</Dialog.Title>
                        <Dialog.Content>
                            {_.get(this.state, 'modalMessage', '')
                                .split('\n')
                                .map((line, i) => (
                                    <Paragraph key={i}>{line}</Paragraph>
                                ))}
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.closeModal} labelStyle={typographyStyles.button}>
                                Cancel
                            </Button>
                            <Button
                                onPress={this.state.modalConfirmation}
                                color="red"
                                labelStyle={typographyStyles.button}
                            >
                                Delete
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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
