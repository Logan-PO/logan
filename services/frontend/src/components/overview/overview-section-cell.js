import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ListItem, ListItemText } from '@material-ui/core';
import { CourseLabel } from '../shared/displays';
import { getSectionSelectors } from '../../store/schedule';

export class OverviewSectionCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            section: this.props.selectSectionFromStore(this.props.sid),
        };
    }

    render() {
        return (
            <div className="list-cell">
                <ListItem>
                    <ListItemText
                        primary={
                            <React.Fragment>
                                <div className="cell-upper-label">
                                    <CourseLabel cid={_.get(this.state, 'section.cid')} />
                                </div>
                                <div>{_.get(this.state, 'section.title')}</div>
                            </React.Fragment>
                        }
                        secondary={_.get(this.state, 'section.location')}
                    />
                </ListItem>
            </div>
        );
    }
}
OverviewSectionCell.propTypes = {
    sid: PropTypes.string,
    cid: PropTypes.string,
    tid: PropTypes.string,
    selectSectionFromStore: PropTypes.func,
};

const mapStateToProps = state => {
    return {
        selectSectionFromStore: getSectionSelectors(state.schedule).selectById,
    };
};

export default connect(mapStateToProps, null)(OverviewSectionCell);
