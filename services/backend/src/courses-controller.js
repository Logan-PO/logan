const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const { v4: uuid } = require('uuid');
const Promise = require('bluebird');
const requestValidator = require('../utils/request-validator');
const { NotFoundError, ValidationError } = require('../utils/errors');
const assignmentsController = require('./assignments-controller');
const tasksController = require('./tasks-controller');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'cid', 'title']),
        nickname: db.nn,
        color: db.col,
    };
}

function toDbFormat(course) {
    return {
        ..._.pick(course, ['uid', 'tid', 'cid', 'title']),
        nn: course.nickname,
        col: course.color,
    };
}

function isValidHexString(str) {
    return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(str);
}

async function getCourse(req, res) {
    const requestedCid = req.params.cid;

    const dbResponse = await dynamoUtils.get({
        TableName: dynamoUtils.TABLES.COURSES,
        Key: { cid: requestedCid },
    });

    if (dbResponse.Item) {
        res.json(fromDbFormat(dbResponse.Item));
    } else {
        throw new NotFoundError('Course does not exist');
    }
}

async function getCourses(req, res) {
    const requestedBy = req.auth.uid;

    const dbResponse = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.COURSES,
        FilterExpression: 'uid = :uid',
        ExpressionAttributeValues: { ':uid': requestedBy },
    });

    res.json(dbResponse.Items.map(fromDbFormat));
}

async function createCourse(req, res) {
    const cid = uuid();

    const course = _.merge({}, req.body, { cid }, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['tid', 'title', 'color']);

    if (!isValidHexString(course.color)) throw new ValidationError(`${course.color} is not a valid hex string`);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.COURSES,
        Item: toDbFormat(course),
    });

    res.json(course);
}

async function updateCourse(req, res) {
    const course = _.merge({}, req.body, req.params, _.pick(req.auth, ['uid']));

    requestValidator.requireBodyParams(req, ['tid', 'title', 'color']);

    if (!isValidHexString(course.color)) throw new ValidationError(`${course.color} is not a valid hex string`);

    await dynamoUtils.put({
        TableName: dynamoUtils.TABLES.COURSES,
        Item: toDbFormat(course),
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    res.json(course);
}

async function deleteCourse(req, res) {
    const requestedCid = req.params.cid;

    await dynamoUtils.delete({
        TableName: dynamoUtils.TABLES.COURSES,
        Key: { cid: requestedCid },
        ExpressionAttributeValues: { ':uid': req.auth.uid },
        ConditionExpression: 'uid = :uid',
    });

    // Delete sub-sections
    const { Items: sections } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.SECTIONS,
        ExpressionAttributeValues: { ':cid': requestedCid },
        FilterExpression: ':cid = cid',
        AutoPaginate: true,
    });

    const sectionDeletes = dynamoUtils.makeDeleteRequests(sections, 'sid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.SECTIONS]: sectionDeletes });

    // Delete sub-assignments
    const { Items: assignments } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.ASSIGNMENTS,
        ExpressionAttributeValues: { ':cid': requestedCid },
        FilterExpression: ':cid = cid',
        AutoPaginate: true,
    });

    const assignmentDeletes = dynamoUtils.makeDeleteRequests(assignments, 'aid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.ASSIGNMENTS]: assignmentDeletes });

    // Delete sub-tasks
    const { Items: tasks } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.TASKS,
        ExpressionAttributeValues: { ':cid': requestedCid },
        FilterExpression: ':cid = cid',
        AutoPaginate: true,
    });

    const taskDeletes = dynamoUtils.makeDeleteRequests(tasks, 'tid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.TASKS]: taskDeletes });

    await handleCascadingDeletes(requestedCid);

    res.json({ success: true });
}

async function handleCascadingDeletes(cid) {
    // Delete sub-sections
    const { Items: sections } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.SECTIONS,
        ExpressionAttributeValues: { ':cid': cid },
        FilterExpression: ':cid = cid',
        AutoPaginate: true,
    });

    const sectionDeletes = dynamoUtils.makeDeleteRequests(sections, 'sid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.SECTIONS]: sectionDeletes });

    // Delete sub-assignments
    const { Items: assignments } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.ASSIGNMENTS,
        ExpressionAttributeValues: { ':cid': cid },
        FilterExpression: ':cid = cid',
        AutoPaginate: true,
    });

    const assignmentDeletes = dynamoUtils.makeDeleteRequests(assignments, 'aid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.ASSIGNMENTS]: assignmentDeletes });

    // Delete sub-tasks for sub-assignments
    await Promise.map(assignments, ({ aid }) => assignmentsController.handleCascadingDeletes(aid), { concurrency: 10 });

    // Delete sub-tasks
    const { Items: tasks } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.TASKS,
        ExpressionAttributeValues: { ':cid': cid },
        FilterExpression: ':cid = cid',
        AutoPaginate: true,
    });

    const taskDeletes = dynamoUtils.makeDeleteRequests(tasks, 'tid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.TASKS]: taskDeletes });
    await Promise.map(tasks, ({ tid }) => tasksController.handleCascadingDeletes(tid));
}

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getCourse,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    handleCascadingDeletes,
};
