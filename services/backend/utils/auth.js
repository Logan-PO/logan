const _ = require('lodash');
const { AWS, secretUtils } = require('@logan/aws');
const jwt = require('jsonwebtoken');

const dynamo = new AWS.DynamoDB.DocumentClient();

const UNAUTHORIZED_ACTIONS = {
    CREATE_USER: 'create_user',
};

async function getAuthSecret(clientType) {
    const secret = await secretUtils.getSecret('logan/auth-secrets');
    return secret[clientType];
}

async function generateBearerToken(payload, clientType) {
    const authSecret = await getAuthSecret(clientType);
    return jwt.sign(payload, authSecret);
}

/**
 * Check the request's authorization header
 * @param req
 * @param {boolean} authRequired
 * @param {string | undefined} unauthedAction
 * @returns {Promise<void>}
 */
async function handleAuth(req, authRequired = false, unauthedAction) {
    const authHeader = _.get(req, ['headers', 'Authorization']);
    if (!authHeader || !_.startsWith(authHeader, 'Bearer ')) {
        if (authRequired || unauthedAction) throw new Error('Missing bearer token');
        else {
            req.auth = { authorized: false };
            return;
        }
    }

    const authSecret = await getAuthSecret('web');
    const bearer = authHeader.split(' ')[1];
    const payload = jwt.verify(bearer, authSecret);

    if (unauthedAction && payload.action !== unauthedAction) throw new Error('Not authorized');

    if (payload.uid) {
        const response = await dynamo
            .query({
                TableName: 'users',
                Key: { uid: payload.uid },
            })
            .promise();

        if (response.Item) {
            req.auth = {
                authorized: true,
                ...response.Item,
            };

            return;
        }
    }

    req.auth = {
        authorized: false,
        ...payload,
    };
}

module.exports = {
    UNAUTHORIZED_ACTIONS,
    generateBearerToken,
    handleAuth,
};
