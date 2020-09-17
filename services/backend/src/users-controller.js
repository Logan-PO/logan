const _ = require('lodash');
const { AWS } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const { generateBearerToken } = require('../utils/auth');

const dynamo = new AWS.DynamoDB.DocumentClient();

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

    const dbResponse = await dynamo
        .get({
            TableName: 'users',
            Key: { uid: requestedUid },
        })
        .promise();

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
    const uniquenessResponse = await dynamo
        .scan({
            TableName: 'users',
            FilterExpression: 'uid = :uid OR email = :email OR uname = :uname',
            ExpressionAttributeValues: {
                ':uid': uid,
                ':email': user.email,
                ':uname': user.uname,
            },
        })
        .promise();

    if (uniquenessResponse.Count > 0) throw new Error('uid, email, and username must all be unique');

    // Create the new user
    const bearer = await generateBearerToken({ uid }, 'web');
    await dynamo.put({ TableName: 'users', Item: user }).promise();

    // Return the new user data and a new bearer token for authorizing future requests
    res.json({ user, bearer });
}

async function updateUser(req, res) {}

async function deleteUser(req, res) {}

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
