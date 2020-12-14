const { handleAuth } = require('./auth');
const { LoganError } = require('./errors');

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
        try {
            await handleAuth(event, config.authRequired, config.unauthedAction);
            const response = await handler(event);

            if (typeof response === 'object') {
                return {
                    statusCode: 200,
                    body: JSON.stringify(response),
                };
            } else {
                return {
                    statusCode: 200,
                    body: `${response}`,
                };
            }
        } catch (e) {
            console.error(e);

            if (e instanceof LoganError) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        type: e.constructor.name,
                        error: e.message,
                    }),
                };
            } else {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        error: e.message,
                        stack: e.stack,
                    }),
                };
            }
        }
    };
}

module.exports = {
    makeHandler,
};
