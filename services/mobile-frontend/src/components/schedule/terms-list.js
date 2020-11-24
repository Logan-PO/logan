import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTermSelectors } from '@logan/fe-shared/store/schedule';
import ViewController from '../shared/view-controller';

class TermsList extends React.Component {
    render() {
        return (
            <ViewController
                title="Terms"
                navigation={this.props.navigation}
                route={this.props.route}
                disableBack
                leftActionIsFetch={true}
            />
        );
    }
}

TermsList.propTypes = {
    terms: PropTypes.array,
    navigation: PropTypes.object,
    route: PropTypes.object,
};

const mapStateToProps = state => ({
    terms: getTermSelectors(state.schedule).selectAll(),
});

export default connect(mapStateToProps, null)(TermsList);
