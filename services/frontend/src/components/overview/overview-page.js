import React from 'react';
import { Page } from '../shared';
import OverviewWeekly from './overview-weekly';

export class OverviewPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page title="Overview">
                <OverviewWeekly />
            </Page>
        );
    }
}
