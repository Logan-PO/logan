const _ = require('lodash');

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

    if (missingParams.length === 1) {
        throw new Error(`Missing required property in query: ${missingParams[0]}`);
    } else if (missingParams.length) {
        throw new Error(`Missing required properties in query: ${missingParams.join(', ')}`);
    }

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

    if (missingParams.length === 1) {
        throw new Error(`Missing required property in body: ${missingParams[0]}`);
    } else if (missingParams.length) {
        throw new Error(`Missing required properties in body: ${missingParams.join(', ')}`);
    }

    return out;
}

module.exports = {
    requireQueryParams,
    requireBodyParams,
};
