const _ = require('lodash');
const { v4: uuid } = require('uuid');
const Promise = require('bluebird');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError, ValidationError } = require('../../utils/errors');
const { makeHandler } = require('../../utils/wrap-handler');
const assignmentsController = require('./assignments-controller');
const tasksController = require('./tasks-controller');
const { dynamoUtils } = require('packages/aws');

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

const getCourse = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedCid = event.pathParameters.cid;

        const dbResponse = await dynamoUtils.get({
            TableName: dynamoUtils.TABLES.COURSES,
            Key: { cid: requestedCid },
        });

        if (dbResponse.Item) {
            return fromDbFormat(dbResponse.Item);
        } else {
            throw new NotFoundError('Course does not exist');
        }
    },
});

const getCourses = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedBy = event.auth.uid;

        const dbResponse = await dynamoUtils.scan({
            TableName: dynamoUtils.TABLES.COURSES,
            FilterExpression: 'uid = :uid',
            ExpressionAttributeValues: { ':uid': requestedBy },
        });

        return dbResponse.Items.map(fromDbFormat);
    },
});

const createCourse = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const cid = uuid();

        const course = _.merge({}, event.body, { cid }, _.pick(event.auth, ['uid']));

        requestValidator.requireBodyParams(event, ['tid', 'title', 'color']);

        if (!isValidHexString(course.color)) throw new ValidationError(`${course.color} is not a valid hex string`);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.COURSES,
            Item: toDbFormat(course),
        });

        return course;
    },
});

const updateCourse = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const course = _.merge({}, event.body, event.pathParameters, _.pick(event.auth, ['uid']));

        requestValidator.requireBodyParams(event, ['tid', 'title', 'color']);

        if (!isValidHexString(course.color)) throw new ValidationError(`${course.color} is not a valid hex string`);

        await dynamoUtils.put({
            TableName: dynamoUtils.TABLES.COURSES,
            Item: toDbFormat(course),
            ExpressionAttributeValues: { ':uid': event.auth.uid },
            ConditionExpression: 'uid = :uid',
        });

        return course;
    },
});

const deleteCourse = makeHandler({
    config: { authRequired: true },
    handler: async event => {
        const requestedCid = event.pathParameters.cid;

        await dynamoUtils.delete({
            TableName: dynamoUtils.TABLES.COURSES,
            Key: { cid: requestedCid },
            ExpressionAttributeValues: { ':uid': event.auth.uid },
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

        return { success: true };
    },
});

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
