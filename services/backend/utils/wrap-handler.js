const _ = require('lodash');
const { handleAuth } = require('./auth');
const { LoganError } = require('./errors');

const VALID_ORIGINS = ['http://localhost:8000', 'http://logan-frontend.s3-website-us-west-2.amazonaws.com'];

/**
 * @typedef HandlerConfig
 * @property {boolean} authRequired
 * @property {string} [unauthedAction]
 */

/**
 * @typedef LambdaResponse
 * @property {number} statusCode
 * @property {string} body
 * @property {object} [headers]
 */

/**
 * Wrap a Lambda handler function with error handling and auth parsing
 * @param {HandlerConfig} config
 * @param {function} handler
 * @return {function(*=): Promise<LambdaResponse>}
 */
function makeHandler({ config, handler }) {
    return async event => {
        const lambdaResponse = {};

        const origin = _.get(event, 'headers.origin') || _.get(event, 'headers.Origin');

        if (origin && VALID_ORIGINS.includes(origin)) {
            lambdaResponse.headers = {
                'Access-Control-Allow-Origin': origin,
            };
        }

        try {
            await handleAuth(event, config.authRequired, config.unauthedAction);
            const response = await handler(event);

            lambdaResponse.statusCode = 200;

            if (typeof response === 'object') {
                lambdaResponse.body = JSON.stringify(response);
            } else {
                lambdaResponse.body = `${response}`;
            }
        } catch (e) {
            console.error(e);

            lambdaResponse.statusCode = 500;

            if (e instanceof LoganError) {
                lambdaResponse.body = JSON.stringify({
                    type: e.constructor.name,
                    error: e.message,
                });
            } else {
                lambdaResponse.body = JSON.stringify({
                    error: e.message,
                    stack: e.stack,
                });
            }
        }

        return lambdaResponse;
    };
}

module.exports = {
    makeHandler,
};
