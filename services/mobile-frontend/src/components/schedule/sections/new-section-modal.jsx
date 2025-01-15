import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appbar } from 'react-native-paper';
import ViewController from '../../shared/view-controller';
import SectionEditor from './section-editor';
import { dateUtils } from 'packages/core';
import { createSection } from 'packages/fe-shared/store/schedule';
import Editor from 'packages/fe-shared/components/editor';

class NewSectionModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);

        this.state = {
            section: {},
        };
    }

    close() {
        this.props.navigation.goBack();
    }

    async create() {
        await this.props.createSection(this.state.section);
        this.close();
    }

    update(section) {
        this.setState({ section });
    }

    render() {
        let isValid = !_.isEmpty(this.state.section.title);

        const startDate = dateUtils.toDate(this.state.section.startDate);
        const endDate = dateUtils.toDate(this.state.section.endDate);

        const startTime = dateUtils.toTime(this.state.section.startTime);
        const endTime = dateUtils.toTime(this.state.section.endTime);

        if (!startDate.isBefore(endDate)) isValid = false;
        else if (!startTime.isBefore(endTime)) isValid = false;

        const leftActions = <Appbar.Action icon="close" onPress={this.close} />;
        const rightActions = (
            <Appbar.Action
                disabled={!isValid}
                icon={props => <Icon {...props} name="done" color="white" size={24} />}
                onPress={this.create}
            />
        );

        return (
            <ViewController
                title="New Section"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActions={leftActions}
                rightActions={rightActions}
            >
                <ScrollView keyboardDismissMode="on-drag">
                    <SectionEditor
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

NewSectionModal.propTypes = {
    createSection: PropTypes.func,
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const mapDispatchToState = {
    createSection,
};

export default connect(null, mapDispatchToState)(NewSectionModal);
