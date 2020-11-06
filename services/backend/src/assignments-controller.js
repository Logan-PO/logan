const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATE_FORMAT },
    },
} = require('@logan/core');
const { v4: uuid } = require('uuid');
const Promise = require('bluebird');
const requestValidator = require('../utils/request-validator');
const { NotFoundError, ValidationError } = require('../utils/errors');
const tasksController = require('./tasks-controller');
const { remindersForEntity } = require('./reminders-controller');

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

function validateDueDate(str) {
    if (!dayjs(str, DB_DATE_FORMAT).isValid()) {
        throw new ValidationError(`Invalid due date ${str}. Must be in format ${DB_DATE_FORMAT}`);
    }
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
        throw new NotFoundError('Assignment does not exist');
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

    validateDueDate(assignment.dueDate);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.ASSIGNMENTS,
        Item: toDbFormat(assignment),
    });

    res.json(assignment);
}

async function updateAssignment(req, res) {
    const assignment = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['title', 'dueDate']);
    validateDueDate(assignment.dueDate);

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

    await handleCascadingDeletes(requestedAid);

    res.json({ success: true });
}

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
