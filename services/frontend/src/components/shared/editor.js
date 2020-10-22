import _ from 'lodash';
import React from 'react';
import UpdateTimer from '../../utils/update-timer';
import './editor.scss';

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

        this.changesExist = false;
        this.updateTimer = new UpdateTimer(config.interval || 1000, () => {
            this.updateEntity(this.state[this._entity]);
            this.changesExist = false;
        });
    }

    isEmpty() {
        return _.isEmpty(this.props[this._id]);
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
        this.changesExist = true;

        const changes = {};

        this.processChange(changes, prop, e);

        this.updateEntityLocal({
            id: this.props[this._id],
            changes,
        });

        this.updateTimer.reset();
    }

    processChange(changes, prop, e) {
        changes[prop] = e.target.value;
    }

    componentDidUpdate(prevProps) {
        if (this.props[this._id] !== prevProps[this._id]) {
            // If the user has selected a new task and updates to the existing task haven't been saved yet, save them
            if (prevProps[this._id] && this.changesExist) {
                const prev = this.selectEntity(prevProps[this._id]);

                if (prev) this.updateTimer.fire();

                this.updateTimer.stop();
            }

            const current = this.selectEntity(this.props[this._id]);
            this.updateCurrentEntityState(current);
        } else {
            // Also if the task has been updated somewhere else, make sure the state reflects that
            const stored = this.selectEntity(this.props[this._id]);
            if (!_.isEqual(stored, this.state[this._entity])) {
                this.updateCurrentEntityState(stored);
            }
        }
    }
}

export default Editor;
