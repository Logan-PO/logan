import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, ListItem, Typography, Button, colors } from '@material-ui/core';
import { dateUtils } from '@logan/core';
import { fetchAssignments, getAssignmentsSelectors } from '../../store/assignments';
import './overview-list.module.scss';
import { fetchTasks, getTasksSelectors } from '../../store/tasks';
import { getScheduleSelectors } from '../../store/schedule';
import OverviewCell from './overview-cell';

const {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT },
} = dateUtils;

export class OverviewWeekly extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>Hello World</div>;
    }
}
