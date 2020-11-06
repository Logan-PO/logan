import React from 'react';
import { Page } from '../shared';
import OverviewScheduleList from './overview-schedule-list';

export class OverviewPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page title="Overview">
                <OverviewScheduleList />
            </Page>
        );
    }
}
