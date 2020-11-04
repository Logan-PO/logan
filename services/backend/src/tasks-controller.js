const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const requestValidator = require('../utils/request-validator');
const { NotFoundError } = require('../utils/errors');
const { remindersForEntity } = require('./reminders-controller');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'title', 'aid', 'cid', 'tags']),
        description: db.desc,
        dueDate: db.due,
        priority: db.pri,
        complete: db.cmp,
        completionDate: db.cd,
    };
}

function toDbFormat(task) {
    return {
        ..._.pick(task, ['uid', 'tid', 'title', 'aid', 'cid']),
        desc: task.description,
        due: task.dueDate,
        pri: task.priority,
        cmp: task.complete,
        cd: task.completionDate,
        tags: _.isEmpty(task.tags) ? undefined : task.tags,
    };
}

async function getTask(req, res) {
    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.TASKS,
        Key: { tid: req.params.tid },
    });

    if (dbResponse.Item) {
        const task = fromDbFormat(dbResponse.Item);
        task.reminders = await remindersForEntity('task', task.tid);
        res.json(task);
    } else {
        throw new NotFoundError('Task does not exist');
    }
}

async function getTasks(req, res) {
    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.TASKS,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': req.auth.uid },
    });

    const { Items: remindersResponse } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.REMINDERS,
        FilterExpression: 'uid = :uid and et = :et',
        ExpressionAttributeValues: { ':uid': req.auth.uid, ':et': 'task' },
    });

    const tasks = dbResponse.Items.map(db => {
        const task = fromDbFormat(db);
        task.reminders = _.filter(remindersResponse, reminder => reminder.eid === task.tid);
        return task;
    });

    res.json(tasks);
}

async function createTask(req, res) {
    const tid = uuid();

    requestValidator.requireBodyParams(req, ['title', 'dueDate', 'priority']);

    const defaultValues = { complete: false };
    const taskInput = _.merge({}, req.body, { tid }, _.pick(req.auth, ['uid']));
    const task = _.defaults(taskInput, defaultValues);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.TASKS,
        Item: toDbFormat(task),
    });

    res.json(task);
}

async function updateTask(req, res) {
    const task = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['title', 'dueDate', 'priority']);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.TASKS,
        Item: toDbFormat(task),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    task.reminders = await remindersForEntity('task', task.tid);

    res.json(task);
}

async function deleteTask(req, res) {
    const requestedTid = req.params.tid;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.TASKS,
        Key: { tid: requestedTid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    await handleCascadingDeletes(requestedTid);

    res.json({ success: true });
}

async function handleCascadingDeletes(tid) {
    const reminders = await remindersForEntity('task', tid);

    const deleteRequests = reminders.map(reminder => ({ DeleteRequest: { Key: _.pick(reminder, 'rid') } }));
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.REMINDERS]: deleteRequests });
}

module.exports = {
    __test_only__: { toDbFormat, fromDbFormat },
    getTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    handleCascadingDeletes,
};
