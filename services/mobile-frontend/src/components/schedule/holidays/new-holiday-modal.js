import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { dateUtils } from '@logan/core';
import { createHoliday } from '@logan/fe-shared/store/schedule';
import Editor from '@logan/fe-shared/components/editor';
import { Appbar } from 'react-native-paper';
import ViewController from '../../shared/view-controller';
import HolidayEditor from './holiday-editor';

class NewHolidayModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);

        this.state = {
            holiday: {},
        };
    }

    close() {
        this.props.navigation.goBack();
    }

    async create() {
        await this.props.createHoliday(this.state.holiday);
        this.close();
    }

    update(course) {
        this.setState({ course });
    }

    render() {
        let isValid = !_.isEmpty(this.state.holiday.title);

        const start = dateUtils.toDate(this.state.holiday.startDate);
        const end = dateUtils.toDate(this.state.holiday.endDate);

        if (!start.isBefore(end)) isValid = false;

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
                title="New Holiday"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActions={leftActions}
                rightActions={rightActions}
            >
                <ScrollView keyboardDismissMode="on-drag">
                    <HolidayEditor
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

NewHolidayModal.propTypes = {
    createHoliday: PropTypes.func,
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const mapDispatchToState = {
    createHoliday,
};

export default connect(null, mapDispatchToState)(NewHolidayModal);
