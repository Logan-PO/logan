export default class UpdateTimer {
    constructor(timeout, callback) {
        this._timeout = timeout;
        this._callback = callback;
    }

    start() {
        this._id = setTimeout(this.fire.bind(this), this._timeout);
    }

    stop() {
        if (this._id) clearTimeout(this._id);
    }

    reset() {
        this.stop();
        this.start();
    }

    fire() {
        this._callback();
    }
}
