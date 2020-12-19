import React from 'react';
import { createTerm } from '@logan/fe-shared/store/schedule';
import { Dialog, DialogTitle } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class TermCreateModal extends React.Component {
    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth={true} maxWidth="xs">
                <DialogTitle>Create Term</DialogTitle>
            </Dialog>
        );
    }
}

TermCreateModal.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    createTerm: PropTypes.func,
};

const mapStateToProps = state => {};

const mapDispatchToProps = { createTerm };

export default connect(mapStateToProps, mapDispatchToProps)(TermCreateModal);
