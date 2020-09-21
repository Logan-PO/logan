const _ = require('lodash');
const { AWS } = require('@logan/aws');
const { v4: uuid } = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'title', 'aid', 'cid']),
        description: db.desc,
        dueDate: db.due,
        priority: db.pri,
        complete: db.cmp,
    };
}

function toDbFormat(task) {
    return {
        ..._.pick(task, ['uid', 'tid', 'title', 'aid', 'cid']),
        desc: task.description,
        due: task.dueDate,
        pri: task.priority,
        cmp: task.complete,
    };
}

async function getTask(req, res) {
    const dbResponse = await dynamo
        .get({
            TableName: 'tasks',
            Key: { tid: req.params.tid },
        })
        .promise();

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new Error('Task does not exist');
    }
}

async function getTasks(req, res) {
    const dbResponse = await dynamo
        .scan({
            TableName: 'tasks',
            FilterExpression: 'uid = :uid',
            ExpressionAttributeValues: { ':uid': req.auth.uid },
        })
        .promise();

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createTask(req, res) {
    const tid = uuid();

    const defaultValues = { complete: false };
    const taskInput = _.merge({}, req.body, { tid }, _.pick(req.auth, ['uid']));
    const task = _.defaults(taskInput, defaultValues);

    if (!task.title) throw new Error('Missing required property: title');
    if (task.dueDate === undefined) throw new Error('Missing required property: dueDate');
    if (task.priority === undefined) throw new Error('Missing required property: priority');

    await dynamo.put({ TableName: 'tasks', Item: toDbFormat(task) }).promise();

    res.json(task);
}

async function updateTask(req, res) {
    const task = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    await dynamo
        .put({
            TableName: 'tasks',
            Item: toDbFormat(task),
            ExpressionAttributeValues: { ':uid': req.auth.uid },
            ConditionExpression: 'uid = :uid',
        })
        .promise();

    res.json(task);
}

async function deleteTask(req, res) {
    const requestedTid = req.params.tid;

    await dynamo
        .delete({
            TableName: 'tasks',
            Key: { tid: requestedTid },
            ExpressionAttributeValues: { ':uid': req.auth.uid },
            ConditionExpression: 'uid = :uid',
        })
        .promise();

    res.json({ success: true });
}

module.exports = {
    getTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
