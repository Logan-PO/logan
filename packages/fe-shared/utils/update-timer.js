export default class UpdateTimer {
    constructor(timeout, callback) {
        this._timeout = timeout;
        this._callback = callback;
    }

    start(procrastinationTimeout) {
        const timeoutToUse = procrastinationTimeout === undefined ? this._timeout : procrastinationTimeout;
        this._id = setTimeout(this.fire.bind(this), timeoutToUse);
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

    procrastinate(offset) {
        this.stop();
        this.start(offset);
    }
}
