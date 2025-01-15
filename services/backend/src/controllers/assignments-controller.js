const _ = require('lodash');
const { dynamoUtils } = require('packages/aws');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATE_FORMAT },
    },
} = require('packages/core');
const { v4: uuid } = require('uuid');
const Promise = require('bluebird');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { makeHandler } = require('../../utils/wrap-handler');
const tasksController = require('./tasks-controller');
const { remindersForEntity } = require('./reminders-controller');

/**
 * @typedef {object} DbAssignment
 * @property {string} uid User ID
 * @property {string} aid Assignment ID
 * @property {string} title
 * @property {string} desc
 * @property {string} cid Associated course ID
 * @property {string} due
 */

/**
 * @typedef {object} Assignment
 * @property {string} uid User ID
 * @property {string} aid Assignment ID
 * @property {string} title
 * @property {string} description
 * @property {string} cid Associated course ID
 * @property {string} dueDate
 */

/**
 * @param {DbAssignment} db
 * @return {Assignment}
 */
function fromDbFormat(db) {
    return {
        ..._.pick(db, ['aid', 'uid', 'title', 'cid']),
        description: db.desc,
        dueDate: db.due,
    };
}

/**
 * @param {Assignment} assignment
 * @return {DbAssignment}
 */
function toDbFormat(assignment) {
    return {
        ..._.pick(assignment, ['aid', 'uid', 'title', 'cid']),
        desc: assignment.description,
        due: assignment.dueDate,
    };
}

function validateDueDate(str) {
    if (!dayjs(str, DB_DATE_FORMAT).isValid()) {
        throw new ValidationError(`Invalid due date ${str}. Must be in format ${DB_DATE_FORMAT}`);
    }
}

const getAssignment = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedAid = event.pathParameters.aid;

        const dbResponse = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.ASSIGNMENTS,
            Key: { aid: requestedAid },
        });

        if (dbResponse.Item) {
            return fromDbFormat(dbResponse.Item);
        } else {
            throw new NotFoundError('Assignment does not exist');
        }
    },
});

const getAssignments = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedBy = event.auth.uid;

        const dbResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.ASSIGNMENTS,
            FilterExpression: 'uid = :uid',
            ExpressionAttributeValues: { ':uid': requestedBy },
        });

        return dbResponse.Items.map(fromDbFormat);
    },
});

const createAssignment = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const aid = uuid();

        requestValidator.requireBodyParams(event, ['title', 'dueDate']);

        const assignment = _.merge({}, event.body, { aid }, _.pick(event.auth, ['uid']));

        validateDueDate(assignment.dueDate);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.ASSIGNMENTS,
            Item: toDbFormat(assignment),
        });

        return assignment;
    },
});

const updateAssignment = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const assignment = _.merge({}, event.body, event.pathParameters, _.pick(event.auth, ['uid']));

        requestValidator.requireBodyParams(event, ['title', 'dueDate']);
        validateDueDate(assignment.dueDate);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.ASSIGNMENTS,
            Item: toDbFormat(assignment),
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return assignment;
    },
});

const deleteAssignment = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedAid = event.pathParameters.aid;

        await dynamoUtils.delete({
            TableName: dynamoUtils.TABLES.ASSIGNMENTS,
            Key: { aid: requestedAid },
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        await handleCascadingDeletes(requestedAid);

        return { success: true };
    },
});

async function handleCascadingDeletes(aid) {
    // Delete subtasks
    const { Items: subtasks } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.TASKS,
        ExpressionAttributeValues: { ':aid': aid },
        FilterExpression: ':aid = aid',
        AutoPaginate: true,
    });

    const deleteRequests = subtasks.map(task => ({ DeleteRequest: { Key: _.pick(task, 'tid') } }));
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.TASKS]: deleteRequests });
    await Promise.map(subtasks, ({ tid }) => tasksController.handleCascadingDeletes(tid));

    // Delete reminders
    const reminders = await remindersForEntity('assignment', aid);
    const deleteRequests2 = reminders.map(reminder => ({ DeleteRequest: { Key: _.pick(reminder, 'rid') } }));
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.REMINDERS]: deleteRequests2 });
}

module.exports = {
    __test_only__: { toDbFormat, fromDbFormat },
    getAssignment,
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    handleCascadingDeletes,
};
