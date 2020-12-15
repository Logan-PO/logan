const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const { makeHandler } = require('../../utils/wrap-handler');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError } = require('../../utils/errors');
const { remindersForEntity } = require('./reminders-controller');

/**
 * @typedef {object} DbTask
 * @property {string} uid User ID
 * @property {string} tid Task ID
 * @property {string} title Title
 * @property {string} desc Description
 * @property {string} due Due date
 * @property {number} pri Priority (-3 through 3)
 * @property {boolean} cmp Completed
 * @property {string} cd Completion date
 * @property {string} aid Related assignment ID
 * @property {string} cid Related course ID
 * @Property {string[]} tags Tags
 */

/**
 * @typedef {object} Task
 * @property {string} uid User ID
 * @property {string} tid Task ID
 * @property {string} title Title
 * @property {string} description Description
 * @property {string} dueDate Due date
 * @property {number} priority Priority (-3 through 3)
 * @property {boolean} complete Completed
 * @property {string} completionDate Completion date
 * @property {string} aid Related assignment ID
 * @property {string} cid Related course ID
 * @Property {string[]} tags Tags
 */

/**
 * @param {DbTask} db
 * @return {Task}
 */
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

/**
 * @param {Task} task
 * @return {DbTask}
 */
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

const getTask = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const dbResponse = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.TASKS,
            Key: { tid: event.pathParameters.tid },
        });

        if (dbResponse.Item) {
            return fromDbFormat(dbResponse.Item);
        } else {
            throw new NotFoundError('Task does not exist');
        }
    },
});

const getTasks = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const dbResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.TASKS,
            FilterExpression: 'uid = :uid',
            ExpressionAttributeValues: { ':uid': event.auth.uid },
        });

        return dbResponse.Items.map(fromDbFormat);
    },
});

const createTask = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const tid = uuid();

        requestValidator.requireBodyParams(event, ['title', 'dueDate', 'priority']);

        const defaultValues = { complete: false };
        const taskInput = _.merge({}, event.body, { tid }, _.pick(event.auth, ['uid']));
        const task = _.defaults(taskInput, defaultValues);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.TASKS,
            Item: toDbFormat(task),
        });

        return task;
    },
});

const updateTask = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const task = _.merge({}, event.body, event.pathParameters, _.pick(event.auth, ['uid']));

        requestValidator.requireBodyParams(event, ['title', 'dueDate', 'priority']);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.TASKS,
            Item: toDbFormat(task),
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return task;
    },
});

const deleteTask = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedTid = event.pathParameters.tid;

        await dynamoUtils.delete({
            TableName: dynamoUtils.TABLES.TASKS,
            Key: { tid: requestedTid },
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        await handleCascadingDeletes(requestedTid);

        return { success: true };
    },
});

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
