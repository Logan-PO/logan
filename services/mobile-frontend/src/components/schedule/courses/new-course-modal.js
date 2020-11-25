import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createCourse } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import { Appbar } from 'react-native-paper';
import ViewController from '../../shared/view-controller';
import CourseEditor from './course-editor';

class NewCourseModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);

        this.state = {
            course: {},
        };
    }

    close() {
        this.props.navigation.goBack();
    }

    async create() {
        await this.props.createCourse(this.state.course);
        this.close();
    }

    update(course) {
        this.setState({ course });
    }

    render() {
        const leftActions = <Appbar.Action icon="close" onPress={this.close} />;
        const rightActions = (
            <Appbar.Action
                disabled={_.isEmpty(this.state.course.title)}
                icon={props => <Icon {...props} name="done" color="white" size={24} />}
                onPress={this.create}
            />
        );

        return (
            <ViewController
                title="New Course"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActions={leftActions}
                rightActions={rightActions}
            >
                <ScrollView keyboardDismissMode="on-drag">
                    <CourseEditor
                        navigation={this.props.navigation}
                        route={this.props.route}
                        mode={Editor.Mode.Create}
                        onChange={this.update}
                    />
                </ScrollView>
            </ViewController>
        );
    }
}

NewCourseModal.propTypes = {
    createCourse: PropTypes.func,
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const mapDispatchToState = {
    createCourse,
};

export default connect(null, mapDispatchToState)(NewCourseModal);
