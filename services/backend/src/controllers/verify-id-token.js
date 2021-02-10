const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { OAuth2Client } = require('google-auth-library');
const { makeHandler } = require('../../utils/wrap-handler');
const auth = require('../../utils/auth');
const requestValidator = require('../../utils/request-validator');

async function verifyIdToken(idToken, clientType = 'web') {
    const { clientId: webClientId } = await auth.getClientCreds('web');
    const { clientId: reqClientId } = await auth.getClientCreds(clientType);

    const client = new OAuth2Client(webClientId);
    const ticket = await client.verifyIdToken({
        idToken,
        audience: reqClientId,
    });

    const { name, email } = ticket.getPayload();

    // Check if the user already exists in DynamoDB
    const response = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.USERS,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
    });

    if (_.isEmpty(response.Items)) {
        // User does not exist
        return {
            exists: false,
            meta: { name, email },
            token: await auth.generateBearerToken({ action: auth.UNAUTHORIZED_ACTIONS.CREATE_USER }),
        };
    } else {
        // User exists
        const user = _.first(response.Items);
        return {
            exists: true,
            user,
            token: await auth.generateBearerToken({ uid: user.uid }),
        };
    }
}

const verifyIdTokenHandler = makeHandler({
    config: { authRequired: false },
    handler: async event => {
        const { idToken, clientType } = requestValidator.requireBodyParams(event, ['idToken', 'clientType']);
        return verifyIdToken(idToken, clientType);
    },
});

module.exports = {
    verifyIdToken,
    verifyIdTokenHandler,
};
