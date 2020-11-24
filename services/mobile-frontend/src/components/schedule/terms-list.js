import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { dateUtils } from '@logan/core';
import { getTermSelectors, deleteTerm } from '@logan/fe-shared/store/schedule';
import ViewController from '../shared/view-controller';
import ListItem from '../shared/list-item';
import Typography from '../shared/typography';

class TermsList extends React.Component {
    constructor(props) {
        super(props);

        this.openTerm = this.openTerm.bind(this);
        this.openDeleteConfirmation = this.openDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
        this.confirmDeletion = this.confirmDeletion.bind(this);

        this.state = {
            termToDelete: undefined,
        };
    }

    openTerm(tid) {
        this.props.navigation.push('Term', { tid });
    }

    openDeleteConfirmation(termToDelete, callbacks) {
        this.setState({
            termToDelete,
            deleteConfirmationCallbacks: callbacks,
        });
    }

    hideDeleteConfirmation() {
        this.state.deleteConfirmationCallbacks.deny();
        this.setState({ termToDelete: undefined, deleteConfirmationCallbacks: undefined });
    }

    async confirmDeletion() {
        const callback = this.state.deleteConfirmationCallbacks.confirm;
        const termToDelete = this.state.termToDelete;
        this.setState({ termToDelete: undefined, deleteConfirmationCallbacks: undefined });
        await callback();
        this.props.deleteTerm(termToDelete);
    }

    render() {
        return (
            <ViewController
                title="Terms"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActionIsFetch={true}
            >
                <ScrollView>
                    {this.props.terms.map(term => (
                        <ListItem
                            key={term.tid}
                            leftContent={
                                <View>
                                    <Typography variant="h6" style={{ marginBottom: 4 }}>
                                        {term.title}
                                    </Typography>
                                    <Typography color="detail">
                                        {dateUtils.humanReadableDate(term.startDate)} -{' '}
                                        {dateUtils.humanReadableDate(term.endDate)}
                                    </Typography>
                                </View>
                            }
                            showRightArrow
                            onPress={this.openTerm.bind(this, term.tid)}
                        />
                    ))}
                </ScrollView>
            </ViewController>
        );
    }
}

TermsList.propTypes = {
    terms: PropTypes.array,
    navigation: PropTypes.object,
    route: PropTypes.object,
    deleteTerm: PropTypes.func,
};

const mapStateToProps = state => ({
    terms: getTermSelectors(state.schedule).selectAll(),
});

export default connect(mapStateToProps, { deleteTerm })(TermsList);
