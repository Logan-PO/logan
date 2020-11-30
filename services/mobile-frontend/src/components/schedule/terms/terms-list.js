import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { getTermSelectors, deleteTerm } from '@logan/fe-shared/store/schedule';
import { Button, Dialog, FAB, Paragraph, Portal } from 'react-native-paper';
import ViewController from '../../shared/view-controller';
import { typographyStyles } from '../../shared/typography';
import TermCell from './term-cell';

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

    openTerm(term) {
        this.props.navigation.push('Term', { tid: term.tid });
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
                rightActionIsSetting={true}
            >
                <ScrollView>
                    {this.props.terms.map(term => (
                        <TermCell
                            key={term.tid}
                            term={term}
                            onPress={() => this.openTerm(term)}
                            onDeletePressed={this.openDeleteConfirmation}
                        />
                    ))}
                </ScrollView>
                <FAB
                    icon="plus"
                    color="white"
                    style={{
                        position: 'absolute',
                        margin: 16,
                        bottom: 0,
                        right: 0,
                    }}
                    onPress={() => this.props.navigation.navigate('New Term')}
                />
                <Portal>
                    <Dialog visible={!!this.state.termToDelete} onDismiss={this.hideDeleteConfirmation}>
                        <Dialog.Title>Are you sure?</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph
                                style={typographyStyles.body2}
                            >{`You're about to delete a term. This can't be undone.`}</Paragraph>
                            <Paragraph
                                style={{ ...typographyStyles.body2, fontWeight: 'bold' }}
                            >{`This will also delete any courses and holidays associated with that term.`}</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.hideDeleteConfirmation} labelStyle={typographyStyles.button}>
                                Cancel
                            </Button>
                            <Button onPress={this.confirmDeletion} color="red" labelStyle={typographyStyles.button}>
                                Delete
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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
