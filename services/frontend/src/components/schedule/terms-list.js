import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Fab,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { getScheduleSelectors, createTerm, deleteTerm } from '../../store/schedule';
import styles from './terms-list.module.scss';

class TermsList extends React.Component {
    constructor(props) {
        super(props);

        this.didSelectTerm = this.didSelectTerm.bind(this);
        this.didDeleteTerm = this.didDeleteTerm.bind(this);

        this.state = {
            selectedTid: undefined,
        };
    }

    randomTerm() {
        return {
            title: 'New term',
            startDate: '2020-01-01',
            endDate: '2020-05-20',
        };
    }

    didSelectTerm(tid) {
        this.setState(() => ({ selectedTid: tid }));
        this.props.onTermSelected && this.props.onTermSelected(tid);
    }

    didDeleteTerm(term) {
        this.props.deleteTerm(term);
        // TODO: Select next term
        this.setState(() => ({ selectedTid: undefined }));
        this.props.onTermSelected && this.props.onTermSelected(undefined);
    }

    render() {
        return (
            <div className={styles.termsList}>
                <div className={styles.scrollview}>
                    <List>
                        <ListSubheader>Terms</ListSubheader>
                        {this.props.tids.map(tid => {
                            const term = this.props.getTerm(tid);
                            const isSelected = tid === this.state.selectedTid;

                            return (
                                <div key={tid} className={styles.termCell}>
                                    <ListItem button selected={isSelected} onClick={() => this.didSelectTerm(tid)}>
                                        <ListItemText primary={term.title} />
                                        <ListItemSecondaryAction className={styles.actions}>
                                            <IconButton edge="end" onClick={() => this.didDeleteTerm(term)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </div>
                <Fab
                    className={styles.addButton}
                    color="secondary"
                    onClick={() => this.props.createTerm(this.randomTerm())}
                >
                    <AddIcon />
                </Fab>
            </div>
        );
    }
}

TermsList.propTypes = {
    tids: PropTypes.array,
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
