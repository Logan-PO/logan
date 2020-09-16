const _ = require('lodash');
const { AWS, secretUtils } = require('@logan/aws');
const jwt = require('jsonwebtoken');

const dynamo = new AWS.DynamoDB.DocumentClient();

async function getAuthSecret(clientType) {
    const secret = await secretUtils.getSecret('logan/auth-secrets');
    return secret[clientType];
}

async function handleAuth(req, res, next) {
    const authHeader = _.get(req, ['headers', 'Authorization']);
    if (!authHeader || !_.startsWith(authHeader, 'Bearer ')) throw new Error('Missing bearer token');

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
            res.auth = {
                authorized: true,
                ...response.Item,
            };

            next();
            return;
        }
    }

    req.auth = {
        authorized: false,
        ...payload,
    };

    next();
}

module.exports = {
    getAuthSecret,
    handleAuth,
};
