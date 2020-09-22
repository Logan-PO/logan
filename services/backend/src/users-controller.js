const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const { generateBearerToken } = require('../utils/auth');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'name', 'email']),
        username: db.uname,
    };
}

function toDbFormat(user) {
    return {
        ..._.pick(user, ['uid', 'name', 'email']),
        uname: user.username,
    };
}

async function getUser(req, res) {
    const requestedUid = req.params.uid;

    // If you request yourself, just return without querying
    if (requestedUid === 'me') {
        res.json(_.pick(req.auth, ['uid', 'name', 'email', 'username']));
        return;
    }

    const dbResponse = await dynamoUtils.get({
        TableName: 'users',
        Key: { uid: requestedUid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new Error('User does not exist');
    }
}

async function createUser(req, res) {
    const uid = uuid();

    const user = toDbFormat({ uid, ...req.body });

    // Make sure all required properties exist
    if (!user.name) throw new Error('Missing required property: name');
    if (!user.email) throw new Error('Missing required property: email');
    if (!user.uname) throw new Error('Missing required property: username');

    // Make sure uid, email, and username are all unique
    const uniquenessResponse = await dynamoUtils.scan({
        TableName: 'users',
        FilterExpression: 'uid = :uid OR email = :email OR uname = :uname',
        ExpressionAttributeValues: {
            ':uid': uid,
            ':email': user.email,
            ':uname': user.uname,
        },
    });

    if (uniquenessResponse.Count > 0) throw new Error('uid, email, and username must all be unique');

    // Create the new user
    const bearer = await generateBearerToken({ uid }, 'web');
    await dynamoUtils.put({ TableName: 'users', Item: user });

    // Return the new user data and a new bearer token for authorizing future requests
    res.json({ user, bearer });
}

async function updateUser(req, res) {
    if (req.auth.uid !== req.params.uid) throw new Error('Cannot modify another user');

    const user = {
        uid: req.auth.uid,
        name: req.body.name || req.auth.name,
        email: req.body.email || req.auth.email,
        uname: req.body.username || req.auth.username,
    };

    // Check if the updated user still has a unique username and email
    const uniquenessResponse = await dynamoUtils.scan({
        TableName: 'users',
        FilterExpression: '(email = :email or uname = :uname) and not uid = :uid',
        ExpressionAttributeValues: {
            ':uid': user.uid,
            ':email': user.email,
            ':uname': user.uname,
        },
    });

    if (uniquenessResponse.Count > 0) throw new Error('email and username must be unique');

    // Update the user
    await dynamoUtils.put({ TableName: 'users', Item: user });
    res.json(fromDbFormat(user));
}

async function deleteUser(req, res) {
    if (req.auth.uid !== req.params.uid) throw new Error('Cannot delete another user');
    await dynamoUtils.delete({ TableName: 'users', Key: { uid: req.auth.uid } });

    // TODO: Also delete all other objects owned by the user

    res.json({ success: true });
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
