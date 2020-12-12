const { handleAuth } = require('./auth');
const { LoganError } = require('./errors');

/**
 * @typedef RouteConfig
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
 * @param {RouteConfig} routeConfig
 * @param {function} handler
 * @return {function(*=): Promise<LambdaResponse>}
 */
function wrapHandler(routeConfig, handler) {
    return async event => {
        try {
            await handleAuth(event, routeConfig.authRequired, routeConfig.unauthedAction);
            const response = await handler(event);

            if (typeof response === 'object') {
                return JSON.stringify(response);
            } else {
                return `${response}`;
            }
        } catch (e) {
            if (e instanceof LoganError) {
                return {
                    statusCode: e.code,
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
    wrapHandler,
};
