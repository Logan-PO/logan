import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { updateUser } from '@logan/fe-shared/store/settings';
import { setLoginStage, fetchSelf } from '@logan/fe-shared/store/login';
import { getCanvasData } from '@logan/fe-shared/utils/canvas-parser';

class CanvasModal extends React.Component {
    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.updateUser = this.updateUser.bind(this);

        this.state = {
            accessToken: 'empty',
            url: 'empty',
            /*user: {
                uid: _.get(this.props, 'user.uid'),
                name: _.get(this.props, 'user.name'),
                email: _.get(this.props, 'user.email'),
                accessToken: 'empty',
                url: 'empty',
            },*/
        };
    }

    close() {
        this.props.onClose();
    }

    /*async updateUser() {
        await this.props.updateUser(this.state.user);
        this.props.fetchSelf();
        this.props.onClose();
    }*/

    async getCanvasAssignments() {
        await getCanvasData(_.get(this.state, 'url'), _.get(this.state, 'accessToken'));
        //TODO: Make an alg to parse out the assignments from the canvas data
        //TODO: For each course get its ID and for each ID get the assignments
        //TODO: check enrollment state from all pulled courses
        //
    }

    async addCanvasAssignments() {
        //TODO: Parse the assignments retrieved from getCanvasAssignments
    }

    handleChange(prop, e) {
        const changes = {};

        changes[prop] = e.target.value;

        console.log(changes);
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth maxWidth="sm">
                <DialogContent>
                    <TextField label="Canvas URL" fullWidth onChange={this.handleChange.bind(this, 'url')} />
                    <TextField label="Access Token" fullWidth onChange={this.handleChange.bind(this, 'accessToken')} />
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            disableElevation
                            onClick={this.addCanvasAssignments}
                        >
                            Change
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}

CanvasModal.propTypes = {
    user: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    updateUser: PropTypes.func,
    fetchSelf: PropTypes.func,
};

const mapStateToProps = state => ({
    user: state.login.user,
});

const mapDispatchToProps = {
    setLoginStage,
    updateUser,
    fetchSelf,
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasModal);
