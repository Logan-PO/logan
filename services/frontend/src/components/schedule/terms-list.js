import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { dateUtils } from 'packages/core';
import { getScheduleSelectors, createTerm, deleteTerm } from 'packages/fe-shared/store/schedule';
import ListHeader from '../shared/list-header';
import Typography from '../shared/typography';
import ListSubheader from '../shared/list-subheader';
import Fab from '../shared/controls/fab';
import '../shared/list.scss';
import TermModal from './term-modal';
import styles from './page-list.module.scss';

class TermsList extends React.Component {
    constructor(props) {
        super(props);

        this.renderListContent = this.renderListContent.bind(this);
        this.didSelectTerm = this.didSelectTerm.bind(this);
        this.didDeleteTerm = this.didDeleteTerm.bind(this);

        this.state = {
            showCreateModal: false,
        };
    }

    didSelectTerm(tid) {
        this.props.onTermSelected(tid);
    }

    didDeleteTerm(term) {
        this.props.deleteTerm(term);
        // TODO: Select next term
        this.props.onTermSelected(undefined);
    }

    renderListContent() {
        const groupings = {};

        for (const tid of this.props.tids) {
            const term = this.props.getTerm(tid);
            if (!term) continue;

            let grouping;

            const start = dateUtils.toDate(term.startDate);
            const end = dateUtils.toDate(term.endDate);
            const today = dateUtils.dayjs().startOf('day');

            if (today.isBefore(start, 'day')) {
                grouping = 'Upcoming';
            } else if (today.isAfter(end, 'day')) {
                grouping = 'Past';
            } else {
                grouping = 'Current';
            }

            if (!groupings[grouping]) groupings[grouping] = [];
            groupings[grouping].push(term);
        }

        const contents = [];

        for (const type of ['Current', 'Upcoming', 'Past']) {
            if (!groupings[type]) continue;

            contents.push(
                <ListSubheader
                    key={type}
                    classes={{ root: styles.subheader }}
                    items={[type.toUpperCase()]}
                    colors={['textPrimary']}
                    showHorizontalDivider
                />
            );

            const terms = groupings[type];

            contents.push(
                ...terms.map(term => {
                    const isSelected = term.tid === this.props.selectedTid;

                    return (
                        <div
                            key={term.tid}
                            className={clsx('list-cell', styles.cell, isSelected && styles.selected)}
                            onClick={() => this.didSelectTerm(term.tid)}
                        >
                            <Typography>{term.title}</Typography>
                            <div className={`actions ${styles.actions}`}>
                                <Tooltip title="Delete">
                                    <IconButton
                                        size="small"
                                        className={styles.action}
                                        onClick={() => this.didDeleteTerm(term)}
                                    >
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    );
                })
            );
        }

        return contents;
    }

    render() {
        return (
            <div className="scrollable-list">
                <div className={`scroll-view ${styles.listContainer}`}>
                    <List className={styles.listContent}>
                        <ListHeader title="Terms" className={styles.header} isBig disableDivider />
                        {this.renderListContent()}
                    </List>
                </div>
                <Fab className="add-button" onClick={() => this.setState({ showCreateModal: true })} />
                <TermModal
                    open={this.state.showCreateModal}
                    onClose={() => this.setState({ showCreateModal: false })}
                />
            </div>
        );
    }
}

TermsList.propTypes = {
    tids: PropTypes.array,
    selectedTid: PropTypes.string,
    getTerm: PropTypes.func,
    createTerm: PropTypes.func,
    deleteTerm: PropTypes.func,
    onTermSelected: PropTypes.func,
};

const mapStateToProps = state => {
    const scheduleSelectors = getScheduleSelectors(state.schedule);

    return {
        tids: scheduleSelectors.baseSelectors.terms.selectIds(),
        getTerm: scheduleSelectors.baseSelectors.terms.selectById,
    };
};

const mapDispatchToProps = { createTerm, deleteTerm };

export default connect(mapStateToProps, mapDispatchToProps)(TermsList);
