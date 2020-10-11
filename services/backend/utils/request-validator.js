const _ = require('lodash');
const { MissingPropertyError } = require('./errors');

function requireParams(req, params, location) {
    const missingParams = [];
    const out = {};

    for (const param of params) {
        if (_.has(req, [location, param])) {
            _.set(out, param, _.get(req, [location, param]));
        } else {
            missingParams.push(param);
        }
    }

    if (missingParams.length) throw new MissingPropertyError(missingParams, location);

    return out;
}

function requireQueryParams(req, params) {
    return requireParams(req, params, 'query');
}

function requireBodyParams(req, params) {
    requireParams(req, params, 'body');
}

module.exports = {
    requireQueryParams,
    requireBodyParams,
};
