import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { dateUtils } from '@logan/core';
import './overview-list.module.scss';

import OverviewScheduleList from './overview-schedule-list';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

export class OverviewWeekly extends React.Component {
    constructor(props) {
        super(props);
        this.state = { listView: false };
        this.changeView = this.changeView.bind(this);
    }

    changeView() {
        this.setState({
            listView: !_.get(this.state, 'listView', false),
        });
    }

    render() {
        return _.get(this.state, 'listView', false) ? (
            <OverviewScheduleList />
        ) : (
            <div>
                <Button onClick={this.changeView}>List View</Button>
                <div>Hello World</div>
            </div>
        );
    }
}
