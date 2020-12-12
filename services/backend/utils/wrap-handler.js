const { handleAuth } = require('./auth');
const { LoganError } = require('./errors');

/**
 * @typedef RouteConfig
 * @property {boolean} authRequired
 * @property {string} [unauthedAction]
 */

/**
 * Wrap a Lambda handler function with error handling and auth parsing
 * @param {RouteConfig} routeConfig
 * @param {function} handler
 * @returns {function(*=): Promise<*|{body: string, statusCode: number}|undefined>}
 */
function wrapHandler(routeConfig, handler) {
    return async event => {
        try {
            await handleAuth(event, routeConfig.authRequired, routeConfig.unauthedAction);
            return handler(event);
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
