const _ = require('lodash');
const { MissingPropertyError } = require('./errors');

function requireQueryParams(req, params) {
    const missingParams = [];
    const out = {};

    for (const param of params) {
        if (_.has(req, ['query', param])) {
            _.set(out, param, _.get(req, ['query', param]));
        } else {
            missingParams.push(param);
        }
    }

    if (missingParams.length) throw new MissingPropertyError(missingParams, 'query');

    return out;
}

function requireBodyParams(req, params) {
    const missingParams = [];
    const out = {};

    for (const param of params) {
        if (_.has(req, ['body', param])) {
            _.set(out, param, _.get(req, ['body', param]));
        } else {
            missingParams.push(param);
        }
    }

    if (missingParams.length) throw new MissingPropertyError(missingParams, 'body');

    return out;
}

module.exports = {
    requireQueryParams,
    requireBodyParams,
};
