import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import UpdateTimer from '../utils/update-timer';

/**
 * @typedef {object} EditorConfig
 * @property {number} [interval]
 * @property {string} id
 * @property {string} entity
 */

class Editor extends React.Component {
    constructor(props, config) {
        super(props);
        this._id = config.id;
        this._entity = config.entity;
        this._isMobile = config.mobile || false;

        this._ownEntityId = this._ownEntityId.bind(this);

        this.isEditor = props.mode !== Editor.Mode.Create;
        this.isCreator = props.mode === Editor.Mode.Create;

        if (this.isEditor) {
            this.changesExist = false;
            this.updateTimer = new UpdateTimer(config.interval || 1000, () => {
                this.updateEntity(this.state[this._entity]);
                this.changesExist = false;
            });
        }

        if (this._isMobile && props.navigation) {
            props.navigation.addListener('blur', this._componentWillExit.bind(this));
        }
    }

    _ownEntityId(props) {
        if (this._isMobile) {
            return _.get(props || this.props, ['route', 'params', this._id]);
        } else {
            return _.get(props || this.props, [this._id]);
        }
    }

    // Mobile only
    _componentWillExit() {
        if (this.changesExist) this.updateTimer.fire();
    }

    isEmpty() {
        return _.isEmpty(this._ownEntityId());
    }

    // eslint-disable-next-line no-unused-vars
    selectEntity(id) {
        console.warn(`selectEntity not implemented for ${this.constructor.name}`);
    }

    updateCurrentEntityState(newValue) {
        this.setState({ [this._entity]: newValue });
    }

    // eslint-disable-next-line no-unused-vars
    updateEntity(entity) {
        console.warn(`updateEntity not implemented for ${this.constructor.name}`);
    }

    // eslint-disable-next-line no-unused-vars
    updateEntityLocal({ id, changes }) {
        console.warn(`updateEntityLocal not implemented for ${this.constructor.name}`);
    }

    handleChange(prop, e) {
        if (this.isEditor) {
            this.changesExist = true;
        }

        const changes = {};

        this.processChange(changes, prop, e);

        // Update the state in advance, to avoid the cursor jump bug
        this._applyChangesToState(changes);

        if (this.isEditor) {
            this.updateEntityLocal({
                id: this._ownEntityId(),
                changes,
            });

            this.updateTimer.reset();
        }
    }

    processChange(changes, prop, e) {
        changes[prop] = e.target.value;
    }

    _applyChangesToState(changes) {
        const updatedEntity = _.merge({}, this.state[this._entity], changes);
        this.setState({ [this._entity]: updatedEntity });
    }

    componentDidMount() {
        if (this.isEditor) {
            const entity = this.selectEntity(this._ownEntityId());
            this.updateCurrentEntityState(entity);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.isCreator) return;

        const currentId = this._ownEntityId();
        const pastId = this._ownEntityId(prevProps);

        if (currentId !== pastId) {
            // If the user has selected a new task and updates to the existing task haven't been saved yet, save them
            if (pastId && this.changesExist) {
                const prev = this.selectEntity(pastId);

                if (prev) this.updateTimer.fire();

                this.updateTimer.stop();
            }

            const current = this.selectEntity(currentId);
            this.updateCurrentEntityState(current);
        } else {
            // Also if the task has been updated somewhere else, make sure the state reflects that
            const stored = this.selectEntity(currentId);
            if (!_.isEqual(stored, this.state[this._entity])) {
                this.updateCurrentEntityState(stored);
            }
        }
    }
}

Editor.Mode = {
    Edit: 'edit',
    Create: 'create',
};

Editor.propTypes = {
    navigation: PropTypes.object,
    mode: PropTypes.oneOf(_.values(Editor.Mode)),
};

Editor.defaultProps = {
    mode: Editor.Mode.Edit,
};

export default Editor;
