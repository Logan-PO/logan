const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const { UNAUTHORIZED_ACTIONS, generateBearerToken } = require('../../utils/auth');
const { makeHandler } = require('../../utils/wrap-handler');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError, ValidationError, PermissionDeniedError } = require('../../utils/errors');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'name', 'email', 'tokens']),
        username: db.uname,
        primaryColor: db.pc,
        accentColor: db.ac,
    };
}

function toDbFormat(user) {
    return {
        ..._.pick(user, ['uid', 'name', 'email', 'tokens']),
        uname: user.username,
        pc: user.primaryColor,
        ac: user.accentColor,
    };
}

const getUser = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        let requestedUid = event.pathParameters.uid;

        if (requestedUid === 'me') requestedUid = event.auth.uid;

        const dbResponse = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.USERS,
            Key: { uid: requestedUid },
        });

        if (dbResponse.Item) {
            return fromDbFormat(dbResponse.Item);
        } else {
            throw new NotFoundError('User does not exist');
        }
    },
});

const createUser = makeHandler({
    config: { authRequired: false, unauthedAction: UNAUTHORIZED_ACTIONS.CREATE_USER },
    handler: async event => {
        const uid = uuid();

        const user = requestValidator.requireBodyParams(event, ['name', 'email', 'username']);
        user.uid = uid;

        // Make sure uid, email, and username are all unique
        const uniquenessResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.USERS,
            FilterExpression: 'uid = :uid OR email = :email OR uname = :uname',
            ExpressionAttributeValues: {
                ':uid': uid,
                ':email': user.email,
                ':uname': user.username,
            },
        });

        if (uniquenessResponse.Count > 0) throw new ValidationError('uid, email, and username must all be unique');

        // Create the new user
        const bearer = await generateBearerToken({ uid });
        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.USERS,
            Item: toDbFormat(user),
        });

        // Return the new user data and a new bearer token for authorizing future requests
        return { user, bearer };
    },
});

const validateUniqueness = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const { Item: user } = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.USERS,
            Key: _.pick(event.auth, 'uid'),
        });

        const potentialUpdate = _.merge({}, user, event.body);

        const uniquenessResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.USERS,
            FilterExpression: 'uname = :uname and not uid = :uid',
            ExpressionAttributeValues: {
                ':uid': user.uid,
                ':uname': potentialUpdate.username,
            },
        });

        return {
            unique: uniquenessResponse.Count === 0,
        };
    },
});

const updateUser = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        if (event.auth.uid !== event.pathParameters.uid) throw new PermissionDeniedError('Cannot modify another user');

        requestValidator.requireBodyParams(event, ['name', 'email', 'username']);
        const user = _.merge({}, event.auth, event.body, event.pathParameters);

        // Check if the updated user still has a unique username and email
        const uniquenessResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.USERS,
            FilterExpression: '(email = :email or uname = :uname) and not uid = :uid',
            ExpressionAttributeValues: {
                ':uid': user.uid,
                ':email': user.email,
                ':uname': user.username,
            },
        });

        if (uniquenessResponse.Count > 0) throw new ValidationError('email and username must be unique');

        // Update the user
        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.USERS,
            Item: toDbFormat(user),
        });

        return user;
    },
});

const deleteUser = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        if (event.auth.uid !== event.pathParameters.uid) throw new PermissionDeniedError('Cannot delete another user');
        await dynamoUtils.delete({ TableName: dynamoUtils.TABLES.USERS, Key: { uid: event.auth.uid } });

        await handleCascadingDeletes(event.auth.uid);

        return { success: true };
    },
});

async function handleCascadingDeletes(uid) {
    const tablesToClean = _.values(_.omit(dynamoUtils.TABLES, ['USERS']));

    for (const tableName of tablesToClean) {
        const { Items: items } = await dynamoUtils.scan({
            TableName: tableName,
            ExpressionAttributeValues: { ':uid': uid },
            FilterExpression: ':uid = uid',
            AutoPaginate: true,
        });

        const deletes = dynamoUtils.makeDeleteRequests(items, dynamoUtils.PKEYS[tableName]);
        await dynamoUtils.batchWrite({ [tableName]: deletes });
    }
}

module.exports = {
    __test_only__: { toDbFormat, fromDbFormat },
    getUser,
    createUser,
    updateUser,
    deleteUser,
    validateUniqueness,
};
