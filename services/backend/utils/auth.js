const _ = require('lodash');
const { AWS, secretUtils } = require('@logan/aws');
const jwt = require('jsonwebtoken');

const dynamo = new AWS.DynamoDB.DocumentClient();

async function getAuthSecret(clientType) {
    const secret = await secretUtils.getSecret('logan/auth-secrets');
    return secret[clientType];
}

/**
 * Check the request's authorization header
 * @param req
 * @param {boolean} authRequired
 * @returns {Promise<void>}
 */
async function handleAuth(req, authRequired = false) {
    const authHeader = _.get(req, ['headers', 'Authorization']);
    if (!authHeader || !_.startsWith(authHeader, 'Bearer ')) {
        if (authRequired) throw new Error('Missing bearer token');
        else {
            req.auth = { authorized: false };
            return;
        }
    }

    const authSecret = await getAuthSecret('web');
    const bearer = authHeader.split(' ')[1];
    const payload = jwt.verify(bearer, authSecret);

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
    getAuthSecret,
    handleAuth,
};
