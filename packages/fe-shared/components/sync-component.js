import React from 'react';

class SyncComponent extends React.Component {
    constructor(props) {
        super(props);

        this.setStateSync = this.setStateSync.bind(this);
    }

    /**
     * Asynchronously update the state
     * @param {Object} state
     */
    async setStateSync(state) {
        return new Promise((resolve, reject) => {
            try {
                this.setState(state, resolve);
            } catch (e) {
                reject(e);
            }
        });
    }
}

export default SyncComponent;
