const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const { generateBearerToken } = require('../../utils/auth');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError, ValidationError, PermissionDeniedError } = require('../../utils/errors');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'name', 'email', 'tokens']),
        username: db.uname,
    };
}

function toDbFormat(user) {
    return {
        ..._.pick(user, ['uid', 'name', 'email', 'tokens']),
        uname: user.username,
    };
}

async function getUser(req, res) {
    const requestedUid = req.params.uid;

    // If you request yourself, just return without querying
    if (requestedUid === 'me' || requestedUid === req.auth.uid) {
        res.json(_.pick(req.auth, ['uid', 'name', 'email', 'username']));
        return;
    }

    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.USERS,
        Key: { uid: requestedUid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new NotFoundError('User does not exist');
    }
}

async function createUser(req, res) {
    const uid = uuid();

    const user = requestValidator.requireBodyParams(req, ['name', 'email', 'username']);
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
    res.json({ user, bearer });
}

async function validateUniqueness(req, res) {
    const { Item: user } = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.USERS,
        Key: _.pick(req.auth, 'uid'),
    });

    const potentialUpdate = _.merge({}, user, req.body);

    const uniquenessResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.USERS,
        FilterExpression: 'uname = :uname and not uid = :uid',
        ExpressionAttributeValues: {
            ':uid': user.uid,
            ':uname': potentialUpdate.username,
        },
    });

    res.json({
        unique: uniquenessResponse.Count === 0,
    });
}

async function updateUser(req, res) {
    if (req.auth.uid !== req.params.uid) throw new PermissionDeniedError('Cannot modify another user');

    requestValidator.requireBodyParams(req, ['name', 'email', 'username']);
    const user = _.merge({}, req.auth, req.body, req.params);

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

    res.json(user);
}

async function deleteUser(req, res) {
    if (req.auth.uid !== req.params.uid) throw new PermissionDeniedError('Cannot delete another user');
    await dynamoUtils.delete({ TableName: dynamoUtils.TABLES.USERS, Key: { uid: req.auth.uid } });

    await handleCascadingDeletes(req.auth.uid);

    res.json({ success: true });
}

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
