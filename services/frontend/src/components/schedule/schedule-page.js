import React from 'react';
import { connect } from 'react-redux';
import { Page } from '../shared';
import { getScheduleSelectors, asyncActions as asyncScheduleActions } from '../../store/schedule';
import TermsList from './terms-list';
import styles from './schedule-page.module.scss';

class SchedulePage extends React.Component {
    render() {
        return (
            <Page title="Schedule">
                <div className={styles.schedulePage}>
                    <div className={styles.list}>
                        <TermsList />
                    </div>
                </div>
            </Page>
        );
    }
}

const mapStateToProps = state => {
    const selectors = getScheduleSelectors(state.schedule);

    return {
        tids: selectors.baseSelectors.terms.selectIds(),
    };
};

const mapDispatchToProps = {
    ...asyncScheduleActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
