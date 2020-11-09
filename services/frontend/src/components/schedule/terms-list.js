import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListSubheader, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { getScheduleSelectors, createTerm, deleteTerm } from '../../store/schedule';
import '../shared/list.scss';

class TermsList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectTerm = this.didSelectTerm.bind(this);
        this.didDeleteTerm = this.didDeleteTerm.bind(this);
    }

    randomTerm() {
        return {
            title: 'New term',
            startDate: '2020-01-01',
            endDate: '2020-05-20',
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

    render() {
        return (
            <div className="scrollable-list">
                <div className="scroll-view">
                    <List>
                        <ListSubheader>Terms</ListSubheader>
                        {[
                            ...this.props.tids.map(tid => {
                                const term = this.props.getTerm(tid);
                                const isSelected = tid === this.props.selectedTid;

                                return (
                                    <div key={tid} className="list-cell">
                                        <ListItem button selected={isSelected} onClick={() => this.didSelectTerm(tid)}>
                                            <ListItemText primary={term.title} />
                                            <ListItemSecondaryAction className="actions">
                                                <IconButton edge="end" onClick={() => this.didDeleteTerm(term)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </div>
                                );
                            }),
                            <div key="add-new" className="list-cell">
                                <ListItem button onClick={() => this.props.createTerm(this.randomTerm())}>
                                    <ListItemText
                                        primary={
                                            <a style={{ display: 'flex', alignItems: 'center' }}>
                                                <AddIcon style={{ marginRight: '0.5rem' }} fontSize="small" />
                                                New term
                                            </a>
                                        }
                                        primaryTypographyProps={{ color: 'primary' }}
                                    />
                                </ListItem>
                            </div>,
                        ]}
                    </List>
                </div>
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
