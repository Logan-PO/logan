const _ = require('lodash');
const { secretUtils, dynamoUtils } = require('packages/aws');
const jwt = require('jsonwebtoken');
const { AuthorizationError, PermissionDeniedError } = require('./errors');

const UNAUTHORIZED_ACTIONS = {
    CREATE_USER: 'create_user',
};

async function getClientCreds(clientType) {
    switch (clientType) {
        case 'web':
            return secretUtils.getSecret('logan/web-google-creds');
        case 'ios':
            return secretUtils.getSecret('logan/ios-google-creds');
        case 'android':
            return secretUtils.getSecret('logan/android-google-creds');
        default:
            throw new AuthorizationError(`Unrecognized client type ${clientType}`);
    }
}

async function getAuthSecret(clientType) {
    const secret = await secretUtils.getSecret('logan/auth-secrets');
    return secret[clientType];
}

async function generateBearerToken(payload) {
    const authSecret = await getAuthSecret('web');
    return jwt.sign(payload, authSecret);
}

/**
 * Check the request's authorization header
 * @param event
 * @param {boolean} authRequired
 * @param {string} [unauthedAction]
 * @returns {Promise<void>}
 */
async function handleAuth(event, authRequired = false, unauthedAction) {
    const authHeader = _.get(event, ['headers', 'Authorization']);
    if (!authHeader || !_.startsWith(authHeader, 'Bearer ')) {
        if (authRequired || unauthedAction) throw new AuthorizationError('Missing bearer token');
        else {
            event.auth = { authorized: false };
            return;
        }
    }

    const authSecret = await getAuthSecret('web');
    const bearer = authHeader.split(' ')[1];
    const payload = jwt.verify(bearer, authSecret);

    if (unauthedAction && payload.action !== unauthedAction) throw new PermissionDeniedError('Not authorized');

    if (payload.uid) {
        const response = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.USERS,
            Key: { uid: payload.uid },
        });

        if (response.Item) {
            event.auth = {
                authorized: true,
                ..._.pick(response.Item, ['uid']),
            };

            return;
        }
    }

    event.auth = {
        authorized: false,
        ...payload,
    };
}

module.exports = {
    UNAUTHORIZED_ACTIONS,
    getClientCreds,
    generateBearerToken,
    handleAuth,
};
