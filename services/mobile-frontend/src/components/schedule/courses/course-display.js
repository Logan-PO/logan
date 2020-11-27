import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import Editor from '@logan/fe-shared/components/editor';
import ViewController from '../../shared/view-controller';
import CourseEditor from './course-editor';

class CourseDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.onUpdate = this.onUpdate.bind(this);
    }

    onUpdate(course) {
        this.setState({ course });
    }

    render() {
        return (
            <ViewController title="Course Details" navigation={this.props.navigation} route={this.props.route}>
                <ScrollView keyboardDismissMode="on-drag">
                    <CourseEditor
                        route={this.props.route}
                        navigation={this.props.navigation}
                        mode={Editor.Mode.Edit}
                        onChange={this.onUpdate}
                    />
                </ScrollView>
            </ViewController>
        );
    }
}

CourseDisplay.propTypes = {
    navigation: PropTypes.object,
    route: PropTypes.object,
};

export default CourseDisplay;
