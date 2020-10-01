const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const requestValidator = require('../utils/request-validator');

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

    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.ASSIGNMENTS,
        Key: { aid: requestedAid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new Error('Assignment does not exist');
    }
}

async function getAssignments(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.ASSIGNMENTS,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': requestedBy },
    });

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createAssignment(req, res) {
    const aid = uuid();

    requestValidator.requireBodyParams(req, ['title', 'dueDate']);

    const assignment = _.merge({}, req.body, { aid }, _.pick(req.auth, ['uid']));

    if (!assignment.title) throw new Error('Missing required property: title');
    if (!assignment.dueDate) throw new Error('Missing required property: dueDate');

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.ASSIGNMENTS,
        Item: toDbFormat(assignment),
    });

    res.json(assignment);
}

async function updateAssignment(req, res) {
    const assignment = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['title', 'dueDate']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.ASSIGNMENTS,
        Item: toDbFormat(assignment),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json(assignment);
}

async function deleteAssignment(req, res) {
    const requestedAid = req.params.aid;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.ASSIGNMENTS,
        Key: { aid: requestedAid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    const { Items: subtasks } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.TASKS,
        ExpressionAttributeValues: { ':aid': requestedAid },
        FilterExpression: ':aid = aid',
        AutoPaginate: true,
    });

    const deleteRequests = subtasks.map(task => ({ DeleteRequest: { Key: _.pick(task, 'tid') } }));
    await dynamoUtils.batchWrite(dynamoUtils.TABLES.TASKS, deleteRequests, true);

    res.json({ success: true });
}

module.exports = {
    __test_only__: { toDbFormat, fromDbFormat },
    getAssignment,
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
};
