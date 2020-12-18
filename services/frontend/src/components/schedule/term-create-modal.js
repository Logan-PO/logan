import React from 'react';
import { createTerm } from '@logan/fe-shared/store/schedule';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class TermCreateModal extends React.Component {}

TermCreateModal.propTypes = {
    createTerm: PropTypes.func,
};

const mapStateToProps = state => {};

const mapDispatchToProps = { createTerm };

export default connect(mapStateToProps, mapDispatchToProps)(TermCreateModal);
