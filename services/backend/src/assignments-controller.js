const _ = require('lodash');
const { AWS } = require('@logan/aws');
const { v4: uuid } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['aid', 'uid', 'title', 'cid']),
        description: db.desc,
        dueDate: db.due,
    };
}

function toDbFormat(assignment) {
    return {
        ..._.pick(assignment, ['aid', 'uid', 'title', 'cid']),
        desc: assignment.description,
        due: assignment.dueDate,
    };
}

async function getAssignment(req, res) {
    const requestedAid = req.params.aid;

    const dbResponse = await dynamo
        .get({
            TableName: 'assignments',
            Key: { aid: requestedAid },
        })
        .promise();

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new Error('Assignment does not exist');
    }
}

async function getAssignments(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamo
        .scan({
            TableName: 'assignments',
            FilterExpression: 'uid = :uid',
            ExpressionAttributeValues: { ':uid': requestedBy },
        })
        .promise();

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createAssignment(req, res) {
    const aid = uuid();

    const assignment = _.merge({}, req.body, { aid }, _.pick(req.auth, ['uid']));

    if (!assignment.title) throw new Error('Missing required property: title');
    if (!assignment.dueDate) throw new Error('Missing required property: dueDate');

    await dynamo
        .put({
            TableName: 'assignments',
            Item: toDbFormat(assignment),
        })
        .promise();

    res.json(assignment);
}

async function updateAssignment(req, res) {
    const assignment = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    await dynamo
        .put({
            TableName: 'assignments',
            Item: toDbFormat(assignment),
            ExpressionAttributeValues: { ':uid': req.auth.uid },
            ConditionExpression: 'uid = :uid',
        })
        .promise();

    res.json(assignment);
}

async function deleteAssignment(req, res) {
    const requestedAid = req.params.aid;

    await dynamo
        .delete({
            TableName: 'assignments',
            Key: { aid: requestedAid },
            ExpressionAttributeValues: { ':uid': req.auth.uid },
            ConditionExpression: 'uid = :uid',
        })
        .promise();

    res.json({ success: true });
}

module.exports = {
    getAssignment,
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
};
